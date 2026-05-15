import { db } from "@/lib/db";
import { id } from "@instantdb/react-native";
import { generateGreeting, GroqRateLimitError, sendMessage, transcribeAudio } from "@/lib/groq";
import { speak, TTSHandle } from "@/lib/tts";
import { VoiceOrb } from "@/components/VoiceOrb";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────

type VoiceState = "idle" | "listening" | "thinking" | "speaking";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

// ─── Subject theming ──────────────────────────────────────────────────────────

const SUBJECT_EMOJI: Record<string, string> = {
  Mathematics: "📐",
  Science: "🔬",
  English: "📖",
  History: "🏛️",
  Geography: "🌍",
};

const SUBJECT_BG: Record<string, string> = {
  Mathematics: "#1e3a8a",
  Science: "#064e3b",
  English: "#3b0764",
  History: "#78350f",
  Geography: "#14532d",
};

const SUBJECT_ACCENT: Record<string, string> = {
  Mathematics: "#3b82f6",
  Science: "#10b981",
  English: "#8b5cf6",
  History: "#f59e0b",
  Geography: "#22c55e",
};

const DEFAULT_BG = "#1e1b4b";
const DEFAULT_ACCENT = "#4f46e5";

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function StudentScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();

  const { isLoading, data } = db.useQuery(
    token
      ? { agents: { $: { where: { shareToken: token } } } }
      : null
  );

  const agent = data?.agents?.[0];

  const isBrowser = Platform.OS === "web" && typeof window !== "undefined";

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (!agent) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", paddingHorizontal: 32 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#18181b", textAlign: "center", marginBottom: 8 }}>
          Agent not found
        </Text>
        <Text style={{ fontSize: 14, color: "#71717a", textAlign: "center" }}>
          This link may be invalid or the agent has been removed.
        </Text>
      </View>
    );
  }

  return <VoiceInterface agent={agent} isBrowser={isBrowser} />;
}

// ─── Voice Interface ──────────────────────────────────────────────────────────

function VoiceInterface({ agent, isBrowser }: { agent: any; isBrowser: boolean }) {
  const [started, setStarted] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [greetingLoading, setGreetingLoading] = useState(true);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [statusText, setStatusText] = useState("Tap the mic or type below");
  const [textInput, setTextInput] = useState("");

  const scrollRef = useRef<ScrollView>(null);
  const cancelTTSRef = useRef<(() => void) | null>(null);
  const ttsCancelledRef = useRef(false); // true when user explicitly stops/interrupts
  const greetingTextRef = useRef<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const bgColor = SUBJECT_BG[agent.subject] ?? DEFAULT_BG;
  const accentColor = SUBJECT_ACCENT[agent.subject] ?? DEFAULT_ACCENT;
  const subjectEmoji = SUBJECT_EMOJI[agent.subject] ?? "🤖";

  const showMicButton = isBrowser && !micPermissionDenied;

  // Generate opening greeting on mount
  useEffect(() => {
    generateGreeting(
      agent.systemPrompt,
      agent.contextText ?? null,
      agent.gradeLevel ?? "6",
      agent.language ?? "English",
      agent.subject ?? "",
      agent.name ?? ""
    )
      .then((greeting) => {
        greetingTextRef.current = greeting;
        setMessages([{ id: "greeting", role: "assistant", text: greeting }]);
        scrollToBottom();
      })
      .catch(() => {
        // silently skip — student can still interact normally
      })
      .finally(() => {
        setGreetingLoading(false);
      });
  }, []);


  function scrollToBottom() {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }

  function addMessage(role: "user" | "assistant", text: string) {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random(), role, text },
    ]);
    scrollToBottom();
  }

  function stopCurrentTTS() {
    ttsCancelledRef.current = true; // mark as user-cancelled so speakReply won't auto-listen
    if (cancelTTSRef.current) {
      cancelTTSRef.current();
      cancelTTSRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  function idleStatus() {
    setVoiceState("idle");
    setStatusText(showMicButton ? "Tap the orb to speak" : "Voice unavailable — type your question.");
  }

  async function speakReply(reply: string) {
    ttsCancelledRef.current = false; // reset before each utterance
    setVoiceState("speaking");
    setStatusText("Speaking… tap to interrupt");

    const { promise, cancel } = speak(reply, agent.language ?? "English");
    cancelTTSRef.current = cancel;
    try {
      await promise;
    } catch {
      setStatusText("Audio unavailable — read the response above.");
    } finally {
      cancelTTSRef.current = null;
      const wasCancelled = ttsCancelledRef.current;
      // Natural completion → auto-start listening so the conversation flows hands-free.
      // If user cancelled (stop button or barge-in), don't interfere — those paths
      // already set the correct state themselves.
      if (!wasCancelled && showMicButton) {
        await startListening();
      } else if (!wasCancelled) {
        idleStatus(); // no mic available, just return to idle
      }
      // wasCancelled: do nothing — stop button called idleStatus(), barge-in called startListening()
    }
  }

  async function processUserInput(input: string) {
    const trimmed = input.trim();
    if (!trimmed) return;

    const updatedHistory = [
      ...messages.map((m) => ({ role: m.role as "user" | "assistant", text: m.text })),
      { role: "user" as const, text: trimmed },
    ];

    addMessage("user", trimmed);
    setVoiceState("thinking");
    setStatusText("Thinking…");

    try {
      const reply = await sendMessage(
        agent.systemPrompt,
        agent.contextText ?? null,
        updatedHistory,
        agent.gradeLevel ?? "6",
        agent.language ?? "English",
        agent.subject ?? ""
      );
      addMessage("assistant", reply);
      // fire-and-forget — log question without blocking the conversation
      db.transact(
        db.tx.questionLog[id()].update({
          agentId: agent.id,
          question: trimmed,
          createdAt: Date.now(),
        })
      );
      await speakReply(reply);
    } catch (err: any) {
      setVoiceState("idle");
      setStatusText(
        err instanceof GroqRateLimitError
          ? err.message
          : "Something went wrong — tap to try again."
      );
    }
  }

  async function startListening() {
    stopCurrentTTS();
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current = [];

        if (audioBlob.size === 0) {
          setVoiceState("idle");
          setStatusText("Tap the orb to speak");
          return;
        }

        setVoiceState("thinking");
        setStatusText("Thinking…");

        try {
          const transcript = await transcribeAudio(audioBlob, agent.language);
          if (!transcript.trim()) {
            setVoiceState("idle");
            setStatusText("Didn't catch that — tap to try again.");
            return;
          }
          await processUserInput(transcript);
        } catch (err: any) {
          setVoiceState("idle");
          setStatusText(
            err instanceof GroqRateLimitError
              ? err.message
              : "Didn't catch that — tap to try again."
          );
        }
      };

      recorder.start();
      setVoiceState("listening");
      setStatusText("Listening…");
    } catch (err: any) {
      const isPermissionError =
        err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError";
      if (isPermissionError) {
        setMicPermissionDenied(true);
        setStatusText("Voice unavailable — type your question.");
      } else {
        setVoiceState("idle");
        setStatusText("Couldn't access microphone. Type below.");
      }
    }
  }

  async function handleOrbPress() {
    if (voiceState === "thinking") return; // busy

    if (voiceState === "listening") {
      // Stop recording → transcribe
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      return;
    }

    if (voiceState === "speaking") {
      // Barge-in: stop TTS, then immediately start listening
      stopCurrentTTS();
      await startListening();
      return;
    }

    // idle
    await startListening();
  }

  function handleSendText() {
    if (!textInput.trim() || voiceState !== "idle") return;
    Keyboard.dismiss();
    const text = textInput;
    setTextInput("");
    processUserInput(text);
  }

  function gradeLabel(g: string): string {
    const n = parseInt(g, 10);
    if (!isNaN(n)) return `Grade ${n}`;
    const bands: Record<string, string> = { elementary: "Elementary", middle: "Middle School", high: "High School" };
    return bands[g] ?? g;
  }

  const isDisabled = voiceState !== "idle"; // for text input / send button

  // ─── Welcome screen ───────────────────────────────────────────────────────

  if (!started) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }} edges={["top", "bottom"]}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 28 }}>
          {/* Subject avatar */}
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 30,
              backgroundColor: "rgba(255,255,255,0.15)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 28,
            }}
          >
            <Text style={{ fontSize: 48 }}>{subjectEmoji}</Text>
          </View>

          {/* Agent name */}
          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              color: "#fff",
              textAlign: "center",
              letterSpacing: -0.5,
              marginBottom: 6,
            }}
          >
            {agent.name}
          </Text>

          {/* Subject + Grade */}
          <Text
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.55)",
              fontWeight: "600",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 36,
            }}
          >
            {agent.subject} · {gradeLabel(agent.gradeLevel ?? "6")}
          </Text>

          {/* Greeting card */}
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.12)",
              borderRadius: 20,
              padding: 22,
              marginBottom: 32,
              width: "100%",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.15)",
            }}
          >
            {greetingLoading ? (
              <ActivityIndicator color="rgba(255,255,255,0.6)" style={{ paddingVertical: 8 }} />
            ) : (
              <Text
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 16,
                  lineHeight: 26,
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                "{greetingTextRef.current ?? `Hi! I'm your ${agent.subject} helper. Let's get started!`}"
              </Text>
            )}
          </View>

          {/* Start button */}
          <Pressable
            disabled={greetingLoading}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setStarted(true);
              if (greetingTextRef.current) speakReply(greetingTextRef.current);
            }}
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#f0f0ff" : "#ffffff",
              borderRadius: 18,
              paddingVertical: 18,
              width: "100%",
              alignItems: "center",
              opacity: greetingLoading ? 0.5 : 1,
            })}
          >
            <Text style={{ color: bgColor, fontSize: 17, fontWeight: "800", letterSpacing: 0.3 }}>
              Start Learning →
            </Text>
          </Pressable>

          {/* Language tag */}
          <Text
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: 12,
              marginTop: 22,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            {agent.language}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Chat UI ──────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top", "bottom"]}>

      {/* ── Slim top bar ── */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          backgroundColor: "#ffffff",
        }}
      >
        {/* Accent dot */}
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: accentColor }} />
        <Text style={{ fontSize: 13, fontWeight: "700", color: "#18181b", letterSpacing: 0.2, flex: 1 }}>
          {agent.name}
        </Text>
        <Text style={{ fontSize: 12, color: "#a1a1aa" }}>
          {agent.subject} · {gradeLabel(agent.gradeLevel ?? "6")}
        </Text>
      </View>

      {/* thin rule */}
      <View style={{ height: 1, backgroundColor: "#f2f2f5" }} />

      {/* ── Conversation ── */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, backgroundColor: "#ffffff" }}
        contentContainerStyle={{ paddingBottom: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Greeting hero ── */}
        <View
          style={{
            paddingHorizontal: 22,
            paddingTop: 32,
            paddingBottom: 28,
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          {/* Large avatar */}
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: accentColor + "18",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              shadowColor: accentColor,
              shadowOpacity: 0.2,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <Text style={{ fontSize: 34 }}>{subjectEmoji}</Text>
          </View>
          {/* Hero text */}
          <View style={{ flex: 1, paddingTop: 6 }}>
            <Text style={{ fontSize: 16, color: "#71717a", fontWeight: "500", marginBottom: 4 }}>
              Hi there!
            </Text>
            <Text style={{ fontSize: 24, fontWeight: "800", color: "#18181b", letterSpacing: -0.5, lineHeight: 30 }}>
              How can I{"\n"}help you?
            </Text>
          </View>
        </View>

        {/* ── Loading state ── */}
        {greetingLoading && (
          <View style={{ paddingHorizontal: 22, marginBottom: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 12 }}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: accentColor + "18", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Text style={{ fontSize: 16 }}>{subjectEmoji}</Text>
              </View>
              <View style={{ backgroundColor: "#f6f6f9", borderRadius: 18, borderBottomLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 12 }}>
                <Text style={{ color: "#c4c4c8", fontSize: 20, letterSpacing: 5 }}>···</Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Messages ── */}
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            const prevIsUser = idx > 0 && messages[idx - 1].role === "user";
            const showAvatar = !isUser && !prevIsUser;

            return isUser ? (
              /* User: soft right-aligned card */
              <View key={msg.id} style={{ alignSelf: "flex-end", maxWidth: "80%", marginBottom: 2 }}>
                <View
                  style={{
                    backgroundColor: "#f4f4f8",
                    borderRadius: 22,
                    borderBottomRightRadius: 5,
                    paddingHorizontal: 18,
                    paddingVertical: 13,
                  }}
                >
                  <Text style={{ fontSize: 15.5, lineHeight: 24, color: "#18181b", fontWeight: "400" }}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            ) : (
              /* Agent: avatar + floating card */
              <View key={msg.id} style={{ flexDirection: "row", alignItems: "flex-end", gap: 10, maxWidth: "88%", marginBottom: 2 }}>
                {/* Avatar — only shown on first in a run */}
                <View style={{ width: 34, flexShrink: 0 }}>
                  {showAvatar ? (
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        backgroundColor: accentColor + "18",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{subjectEmoji}</Text>
                    </View>
                  ) : null}
                </View>
                {/* Card */}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#ffffff",
                    borderRadius: 22,
                    borderBottomLeftRadius: 5,
                    paddingHorizontal: 18,
                    paddingVertical: 14,
                    shadowColor: "#000",
                    shadowOpacity: 0.07,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 3 },
                    borderWidth: 1,
                    borderColor: "#f0f0f4",
                  }}
                >
                  <Text style={{ fontSize: 15.5, lineHeight: 25, color: "#18181b" }}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ── Controls ── */}
      <View
        style={{
          backgroundColor: "#ffffff",
          paddingTop: 12,
          paddingBottom: 18,
          paddingHorizontal: 20,
          borderTopWidth: 1,
          borderTopColor: "#f2f2f5",
        }}
      >
        {/* Voice Orb */}
        {showMicButton && (
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <Pressable
              onPress={handleOrbPress}
              disabled={voiceState === "thinking"}
              hitSlop={24}
              style={{ opacity: voiceState === "thinking" ? 0.75 : 1 }}
            >
              <VoiceOrb state={voiceState} size={130} />
            </Pressable>
            <Text
              style={{
                fontSize: 13,
                color: "#a1a1aa",
                marginTop: 10,
                letterSpacing: 0.3,
                fontWeight: "500",
              }}
            >
              {statusText}
            </Text>
            {voiceState === "speaking" && (
              <Pressable
                onPress={() => { stopCurrentTTS(); idleStatus(); }}
                style={{
                  marginTop: 8,
                  paddingHorizontal: 20,
                  paddingVertical: 6,
                  borderRadius: 20,
                  backgroundColor: "#fef2f2",
                  borderWidth: 1,
                  borderColor: "#fecaca",
                }}
              >
                <Text style={{ fontSize: 12, color: "#ef4444", fontWeight: "700", letterSpacing: 0.4 }}>
                  ■  Stop
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {showMicButton && (
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: "#f2f2f5" }} />
            <Text style={{ fontSize: 11, color: "#d4d4d8", marginHorizontal: 10, fontWeight: "600", letterSpacing: 0.8, textTransform: "uppercase" }}>
              or type
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#f2f2f5" }} />
          </View>
        )}

        {!showMicButton && (
          <Text style={{ fontSize: 12, color: "#a1a1aa", textAlign: "center", marginBottom: 10 }}>
            {statusText}
          </Text>
        )}

        {/* Input row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: "#f6f6f9",
            borderRadius: 28,
            paddingHorizontal: 6,
            paddingVertical: 6,
          }}
        >
          <TextInput
            value={textInput}
            onChangeText={setTextInput}
            placeholder="Ask me anything…"
            placeholderTextColor="#b0b0b8"
            editable={!isDisabled}
            returnKeyType="send"
            onSubmitEditing={handleSendText}
            style={{
              flex: 1,
              height: 44,
              paddingHorizontal: 16,
              fontSize: 15,
              color: "#18181b",
            }}
          />
          <Pressable
            onPress={handleSendText}
            disabled={isDisabled || !textInput.trim()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: isDisabled || !textInput.trim() ? "#e8e8ee" : accentColor,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: accentColor,
              shadowOpacity: isDisabled || !textInput.trim() ? 0 : 0.35,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
            }}
          >
            <Ionicons
              name="arrow-up"
              size={20}
              color={isDisabled || !textInput.trim() ? "#b0b0b8" : "#ffffff"}
            />
          </Pressable>
        </View>

        {/* Clear conversation */}
        {messages.length > 1 && (
          <Pressable
            onPress={() => {
              stopCurrentTTS();
              setMessages(greetingTextRef.current
                ? [{ id: "greeting", role: "assistant", text: greetingTextRef.current }]
                : []);
              setVoiceState("idle");
              setStatusText(showMicButton ? "Tap the orb to speak" : "Voice unavailable — type your question.");
            }}
            style={{ alignItems: "center", marginTop: 12 }}
          >
            <Text style={{ fontSize: 12, color: "#d4d4d8", letterSpacing: 0.2 }}>Clear conversation</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
