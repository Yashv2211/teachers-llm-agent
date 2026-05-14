import { db } from "@/lib/db";
import { generateGreeting, groqVoiceForLanguage, sendMessage, speakWithGroqTTS, transcribeAudio } from "@/lib/groq";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
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

  // Pulse animation for listening state
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (voiceState === "listening") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [voiceState]);

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
    if (cancelTTSRef.current) {
      cancelTTSRef.current();
      cancelTTSRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  async function speakReply(reply: string) {
    setVoiceState("speaking");
    setStatusText("Speaking…");

    const groqVoice = groqVoiceForLanguage(agent.language);

    if (groqVoice) {
      try {
        const { promise, cancel } = await speakWithGroqTTS(reply, groqVoice);
        cancelTTSRef.current = cancel;
        await promise;
        cancelTTSRef.current = null;
        setVoiceState("idle");
        setStatusText(showMicButton ? "Tap the mic or type below" : "Voice unavailable — type your question.");
        return;
      } catch {
        // Fall through to Web Speech API
      }
    }

    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = agent.language ?? "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith(utterance.lang.split("-")[0]) &&
        (v.name.includes("Google") || v.name.includes("Neural") || v.name.includes("Natural"))
    );
    if (preferred) utterance.voice = preferred;

    cancelTTSRef.current = () => window.speechSynthesis.cancel();

    utterance.onend = () => {
      cancelTTSRef.current = null;
      setVoiceState("idle");
      setStatusText(showMicButton ? "Tap the mic or type below" : "Voice unavailable — type your question.");
    };
    utterance.onerror = () => {
      cancelTTSRef.current = null;
      setVoiceState("idle");
      setStatusText(showMicButton ? "Tap the mic or type below" : "Voice unavailable — type your question.");
    };
    window.speechSynthesis.speak(utterance);
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
      await speakReply(reply);
    } catch {
      setVoiceState("idle");
      setStatusText("Something went wrong — tap to try again.");
    }
  }

  async function handleMicPress() {
    if (voiceState === "listening") {
      // Second tap: stop recording
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      return;
    }

    if (voiceState !== "idle") return;

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
          setStatusText("Tap the mic or type below");
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
        } catch {
          setVoiceState("idle");
          setStatusText("Didn't catch that — tap to try again.");
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

  const micColors: Record<VoiceState, string> = {
    idle: accentColor,
    listening: "#ef4444",
    thinking: "#f59e0b",
    speaking: "#10b981",
  };

  const micIconNames: Record<VoiceState, any> = {
    idle: "mic",
    listening: "radio-button-on",
    thinking: "ellipsis-horizontal",
    speaking: "volume-high",
  };

  const micColor = micColors[voiceState];
  const isDisabled = voiceState !== "idle"; // for text input / send button
  const micButtonDisabled = voiceState === "thinking" || voiceState === "speaking";

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
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          borderBottomWidth: 1,
          borderBottomColor: "#f1f1f4",
        }}
      >
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 13,
            backgroundColor: accentColor + "20",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>{subjectEmoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#18181b", letterSpacing: -0.3 }}>
            {agent.name}
          </Text>
          <Text style={{ fontSize: 12, color: "#71717a", fontWeight: "500", marginTop: 1 }}>
            {agent.subject} · {gradeLabel(agent.gradeLevel ?? "6")}
          </Text>
        </View>
        {/* Stop TTS button when speaking */}
        {voiceState === "speaking" && (
          <Pressable
            onPress={stopCurrentTTS}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: "#fef2f2",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="stop" size={16} color="#ef4444" />
          </Pressable>
        )}
      </View>

      {/* Conversation */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16, gap: 10 }}
        keyboardShouldPersistTaps="handled"
      >
        {greetingLoading ? (
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#f5f5ff",
              borderRadius: 18,
              borderBottomLeftRadius: 4,
              paddingHorizontal: 18,
              paddingVertical: 14,
              maxWidth: "80%",
              borderWidth: 1,
              borderColor: "#e8e8f8",
            }}
          >
            <Text style={{ color: "#a1a1aa", fontSize: 14, letterSpacing: 4 }}>···</Text>
          </View>
        ) : null}

        {messages.map((msg) => (
          <View
            key={msg.id}
            style={{
              maxWidth: "82%",
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 12,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              borderBottomRightRadius: msg.role === "user" ? 4 : 18,
              borderBottomLeftRadius: msg.role === "user" ? 18 : 4,
              backgroundColor: msg.role === "user" ? "#3730a3" : "#f5f5ff",
              borderWidth: msg.role === "assistant" ? 1 : 0,
              borderColor: "#e8e8f8",
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text
              style={{
                fontSize: 15,
                lineHeight: 23,
                color: msg.role === "user" ? "#ffffff" : "#1e1b4b",
              }}
            >
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Controls */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#f1f1f4",
          backgroundColor: "#ffffff",
          paddingTop: 16,
          paddingBottom: 16,
          paddingHorizontal: 20,
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -4 },
        }}
      >
        {/* Mic button — shown when mic is available */}
        {showMicButton && (
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: micColor + "18",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Pressable
                  onPress={handleMicPress}
                  disabled={micButtonDisabled}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 38,
                    backgroundColor: micColor,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: micColor,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.45,
                    shadowRadius: 14,
                    elevation: 10,
                    opacity: micButtonDisabled ? 0.6 : 1,
                  }}
                >
                  <Ionicons name={micIconNames[voiceState]} size={30} color="white" />
                </Pressable>
              </Animated.View>
            </View>
            <Text
              style={{
                fontSize: 12,
                color: "#a1a1aa",
                marginTop: 10,
                letterSpacing: 0.3,
              }}
            >
              {statusText}
            </Text>
          </View>
        )}

        {/* Divider */}
        {showMicButton && (
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: "#f4f4f5" }} />
            <Text style={{ fontSize: 11, color: "#d4d4d8", marginHorizontal: 12, fontWeight: "500" }}>
              or type
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#f4f4f5" }} />
          </View>
        )}

        {!showMicButton && (
          <Text style={{ fontSize: 12, color: "#a1a1aa", textAlign: "center", marginBottom: 10, letterSpacing: 0.3 }}>
            {statusText}
          </Text>
        )}

        {/* Text input */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TextInput
            value={textInput}
            onChangeText={setTextInput}
            placeholder="Type your question…"
            placeholderTextColor="#c4c4c8"
            editable={!isDisabled}
            returnKeyType="send"
            onSubmitEditing={handleSendText}
            style={{
              flex: 1,
              height: 46,
              borderRadius: 23,
              borderWidth: 1.5,
              borderColor: isDisabled ? "#f4f4f5" : accentColor + "50",
              backgroundColor: isDisabled ? "#fafafa" : "#ffffff",
              paddingHorizontal: 18,
              fontSize: 15,
              color: "#18181b",
            }}
          />
          <Pressable
            onPress={handleSendText}
            disabled={isDisabled || !textInput.trim()}
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              backgroundColor: isDisabled || !textInput.trim() ? "#f4f4f5" : accentColor,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: accentColor,
              shadowOpacity: isDisabled || !textInput.trim() ? 0 : 0.35,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <Ionicons
              name="arrow-up"
              size={20}
              color={isDisabled || !textInput.trim() ? "#a1a1aa" : "#ffffff"}
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
              setStatusText(showMicButton ? "Tap the mic or type below" : "Voice unavailable — type your question.");
            }}
            style={{ alignItems: "center", marginTop: 14 }}
          >
            <Text style={{ fontSize: 12, color: "#c4c4c8" }}>Clear conversation</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
