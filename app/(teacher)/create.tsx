import { db } from "@/lib/db";
import {
  combineAndTruncate,
  ContextSource,
  extractTextFromDOCX,
  extractTextFromPDF,
  extractTextFromURL,
  extractYouTubeTranscript,
  extractYouTubeVideoId,
} from "@/lib/extractors";
import {
  getLibraryEntries,
  getTrustedSources,
  LIBRARY_SUBJECTS,
} from "@/lib/curriculum-library";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";
import { id } from "@instantdb/react-native";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Templates ────────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    icon: "🌍",
    label: "Geography",
    subject: "Geography",
    systemPrompt:
      "You are Alex, a curious and adventurous geography guide who talks like you've personally visited every corner of the globe. You get genuinely excited about places, landscapes, and cultures. When a student mentions a country or landform, you paint a vivid picture — 'Oh, the Amazon? Imagine standing there with the sounds of the rainforest all around you!' You help students connect geography to their own lives and experiences, always asking what they think or wonder about the world around them.",
  },
  {
    icon: "📜",
    label: "History",
    subject: "History",
    systemPrompt:
      "You are Sam, a passionate history storyteller who believes that understanding the past is like reading the world's most dramatic novel. You bring historical events to life with vivid detail — the people, the stakes, the turning points — and help students see why those moments still echo today. You never just list facts; you make students feel like they're watching history unfold. You love questions like 'What do you think would have happened if...?' and use them to spark real thinking.",
  },
  {
    icon: "🔤",
    label: "Language",
    subject: "English",
    systemPrompt:
      "You are Jordan, a warm and encouraging language arts coach who genuinely loves words — the way they sound, the way they can move people, the way a single perfect sentence can change everything. You celebrate every attempt a student makes and never make them feel embarrassed about mistakes; mistakes are just stepping stones. You explain grammar through everyday examples, help with writing by asking 'what are you really trying to say?', and make vocabulary feel like discovering cool new tools rather than memorizing a list.",
  },
  {
    icon: "🔬",
    label: "Science",
    subject: "Science",
    systemPrompt:
      "You are Dr. Riley, an enthusiastic scientist who finds something mind-blowing in absolutely every topic — and can't help sharing that wonder. You explain concepts the way a scientist actually thinks: starting with curiosity, forming a guess, then working through the evidence. You connect abstract ideas to things students see every day ('That's literally why the sky is blue!') and celebrate when a student asks a question you find genuinely interesting. Science isn't a subject to you — it's a way of seeing the world.",
  },
  {
    icon: "➕",
    label: "Math",
    subject: "Mathematics",
    systemPrompt:
      "You are Maya, a calm, patient, and endlessly encouraging math tutor who truly believes every student can get this — they just haven't found the right explanation yet. You never make a student feel bad for not understanding; instead you say things like 'Great question, let's slow down here' or 'Totally makes sense you'd think that — here's the tricky part.' You walk through problems one small step at a time, always explaining the 'why' behind each move, and offer a fresh analogy whenever something isn't clicking.",
  },
  {
    icon: "📝",
    label: "Blank",
    subject: "",
    systemPrompt: "",
  },
];

const GRADE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];


// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateAgentScreen() {
  const { user } = db.useAuth();

  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [gradeLevel, setGradeLevel] = useState("6");
  const [language, setLanguage] = useState("English");

  const [sources, setSources] = useState<ContextSource[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [activeContextTab, setActiveContextTab] = useState<"file" | "youtube" | "url" | "library">("library");

  // Library browser state
  const [librarySubject, setLibrarySubject] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; subject?: string; systemPrompt?: string }>({});
  const [extractError, setExtractError] = useState("");

  function applyTemplate(index: number) {
    const t = TEMPLATES[index];
    setSelectedTemplate(index);
    setSubject(t.subject);
    setSystemPrompt(t.systemPrompt);
    if (t.subject) setLibrarySubject(t.subject);
    Haptics.selectionAsync();
  }

  const currentGradeNum = parseInt(gradeLevel, 10) || 6;
  const libraryFilterSubject = librarySubject || subject || LIBRARY_SUBJECTS[0];
  const libraryEntries = getLibraryEntries(libraryFilterSubject, currentGradeNum);
  const trustedSources = getTrustedSources(libraryFilterSubject, currentGradeNum);
  const addedIds = new Set(sources.filter((s) => s.type === "library").map((s) => s.label));

  function addLibraryEntry(entry: ReturnType<typeof getLibraryEntries>[0]) {
    if (addedIds.has(entry.title)) return;
    setSources((prev) => [
      ...prev,
      { type: "library", label: entry.title, text: `${entry.content}\n\nSource: ${entry.source}` },
    ]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  // ── Context extraction ──

  async function handleFilePick() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.length) return;
      const asset = result.assets[0];
      setExtracting(true);
      try {
        const file = (asset as any).file as File | undefined;
        if (!file) {
          setExtractError("File extraction requires opening the app in a web browser.");
          return;
        }
        if (file.size > 10 * 1024 * 1024) { setExtractError("File too large — max 10MB. Try a smaller document."); return; }
        let text = "";
        const ext = asset.name.split(".").pop()?.toLowerCase();
        if (ext === "pdf") text = await extractTextFromPDF(file);
        else if (ext === "docx") text = await extractTextFromDOCX(file);
        else { setExtractError("Please upload a PDF or DOCX file."); return; }
        if (!text.trim()) { setExtractError("The file appears to be empty or contains only images."); return; }
        setSources((prev) => [...prev, { type: ext as "pdf" | "docx", label: asset.name, text }]);
        setExtractError("");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } finally { setExtracting(false); }
    } catch (err: any) {
      setExtracting(false);
      setExtractError(err?.message ?? "Failed to process file.");
    }
  }

  async function handleURLExtract(overrideUrl?: string) {
    const url = overrideUrl ?? urlInput;
    if (!url.trim()) return;
    const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
    setExtracting(true);
    try {
      let text = "", label = "";
      if (isYouTube) {
        const videoId = extractYouTubeVideoId(url);
        label = `YouTube: ${videoId}`;
        text = await extractYouTubeTranscript(url);
      } else {
        label = new URL(url).hostname;
        text = await extractTextFromURL(url);
      }
      if (!text.trim()) { setExtractError("Could not extract readable text from that URL."); return; }
      setSources((prev) => [...prev, { type: isYouTube ? "youtube" : "url", label, text }]);
      if (!overrideUrl) setUrlInput("");
      setExtractError("");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      setExtractError(err?.message ?? "Failed to extract content from URL.");
    } finally { setExtracting(false); }
  }

  function removeSource(index: number) {
    setSources((prev) => prev.filter((_, i) => i !== index));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  // ── Save ──

  async function handleSave() {
    if (!user) return;
    setFormError("");
    const errs: typeof fieldErrors = {};
    if (!name.trim()) errs.name = "Agent name is required.";
    if (!subject.trim()) errs.subject = "Subject is required.";
    if (!systemPrompt.trim()) errs.systemPrompt = "Agent instructions are required.";
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      const agentId = id();
      const shareToken = generateToken();
      const contextText = sources.length > 0 ? combineAndTruncate(sources) : undefined;
      const contextSources = sources.length > 0
        ? JSON.stringify(sources.map((s) => ({ type: s.type, label: s.label })))
        : undefined;

      await db.transact(
        db.tx.agents[agentId]
          .update({
            name: name.trim(), subject: subject.trim(), systemPrompt: systemPrompt.trim(),
            gradeLevel, language, shareToken, createdAt: Date.now(),
            ...(contextText ? { contextText } : {}),
            ...(contextSources ? { contextSources } : {}),
          })
          .link({ teacher: user.id })
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(`/(teacher)/agents/${agentId}`);
    } catch (err: any) {
      setFormError(err?.message ?? "Save failed. Please try again.");
    } finally { setSaving(false); }
  }

  const contextCharCount = sources.length > 0 ? combineAndTruncate(sources).length : 0;

  return (
    <SafeAreaView className="flex-1 bg-zinc-50 dark:bg-zinc-950" edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={{ marginBottom: 28 }}>
            <Text style={{ fontSize: 11, fontWeight: "700", color: "#6366f1", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
              Create
            </Text>
            <Text style={{ fontSize: 30, fontWeight: "800", letterSpacing: -0.8 }} className="text-zinc-900 dark:text-white">
              New Agent
            </Text>
            <Text style={{ fontSize: 13, marginTop: 4 }} className="text-zinc-400">
              Set up a voice tutor for your students
            </Text>
          </View>

          {/* Template picker */}
          <SectionLabel>Start with a template</SectionLabel>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 4 }} style={{ marginBottom: 24 }}>
            {TEMPLATES.map((t, i) => {
              const sel = selectedTemplate === i;
              return (
                <Pressable key={t.label} onPress={() => applyTemplate(i)}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                    paddingHorizontal: 18,
                    paddingVertical: 14,
                    minWidth: 76,
                    gap: 6,
                    backgroundColor: sel ? "#4338ca" : "#f4f4f5",
                    borderWidth: sel ? 0 : 1,
                    borderColor: "#e4e4e7",
                    shadowColor: sel ? "#4338ca" : "transparent",
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                  }}
                  className={sel ? "" : "dark:bg-zinc-800 dark:border-zinc-700"}
                >
                  <Text style={{ fontSize: 24 }}>{t.icon}</Text>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: sel ? "#fff" : "#52525b" }} className={sel ? "" : "dark:text-zinc-300"}>{t.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Name */}
          <SectionLabel>Agent name</SectionLabel>
          <TextInput value={name} onChangeText={(v) => { setName(v); if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined })); }} placeholder="e.g. Chapter 4 Verbs Helper" placeholderTextColor="#c4c4c8"
            style={{ marginBottom: fieldErrors.name ? 4 : 20, borderColor: fieldErrors.name ? "#ef4444" : undefined }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3.5 text-base text-zinc-900 dark:text-white" />
          {fieldErrors.name ? <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 16, marginLeft: 4 }}>{fieldErrors.name}</Text> : null}

          {/* Subject */}
          <SectionLabel>Subject</SectionLabel>
          <TextInput value={subject} onChangeText={(v) => { setSubject(v); setLibrarySubject(v); if (fieldErrors.subject) setFieldErrors((p) => ({ ...p, subject: undefined })); }} placeholder="e.g. English – Verbs" placeholderTextColor="#c4c4c8"
            style={{ marginBottom: fieldErrors.subject ? 4 : 20, borderColor: fieldErrors.subject ? "#ef4444" : undefined }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3.5 text-base text-zinc-900 dark:text-white" />
          {fieldErrors.subject ? <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 16, marginLeft: 4 }}>{fieldErrors.subject}</Text> : null}

          {/* Grade level — 1-12 grid */}
          <SectionLabel>Grade level</SectionLabel>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 20 }}>
            {GRADE_NUMBERS.map((g) => {
              const sel = gradeLevel === String(g);
              return (
                <Pressable key={g} onPress={() => { setGradeLevel(String(g)); Haptics.selectionAsync(); }}
                  style={{
                    width: "22%",
                    margin: "1.5%",
                    paddingVertical: 11,
                    borderRadius: 12,
                    alignItems: "center",
                    backgroundColor: sel ? "#4338ca" : "#f4f4f5",
                    borderWidth: sel ? 0 : 1,
                    borderColor: "#e4e4e7",
                    shadowColor: sel ? "#4338ca" : "transparent",
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 3 },
                  }}
                  className={sel ? "" : "dark:bg-zinc-800 dark:border-zinc-700"}
                >
                  <Text style={{ fontWeight: "700", fontSize: 15, color: sel ? "#fff" : "#52525b" }} className={sel ? "" : "dark:text-zinc-200"}>{g}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Language */}
          <SectionLabel>Response language</SectionLabel>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }} style={{ marginBottom: 20 }}>
            {SUPPORTED_LANGUAGES.map(({ label }) => {
              const sel = language === label;
              const lang = label;
              return (
                <Pressable key={lang} onPress={() => { setLanguage(lang); Haptics.selectionAsync(); }}
                  style={{
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: sel ? "#4338ca" : "#f4f4f5",
                    borderWidth: sel ? 0 : 1,
                    borderColor: "#e4e4e7",
                  }}
                  className={sel ? "" : "dark:bg-zinc-800 dark:border-zinc-700"}
                >
                  <Text style={{ fontSize: 13, fontWeight: "600", color: sel ? "#fff" : "#52525b" }} className={sel ? "" : "dark:text-zinc-300"}>{lang}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Instructions */}
          <SectionLabel>Agent instructions</SectionLabel>
          <TextInput value={systemPrompt} onChangeText={(v) => { setSystemPrompt(v); if (fieldErrors.systemPrompt) setFieldErrors((p) => ({ ...p, systemPrompt: undefined })); }}
            placeholder="Describe how the agent should behave, what topics to cover, and how to interact with students…"
            placeholderTextColor="#c4c4c8" multiline numberOfLines={5} textAlignVertical="top"
            style={{ marginBottom: fieldErrors.systemPrompt ? 4 : 20, minHeight: 120, borderColor: fieldErrors.systemPrompt ? "#ef4444" : undefined }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3.5 text-base text-zinc-900 dark:text-white" />
          {fieldErrors.systemPrompt ? <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 16, marginLeft: 4 }}>{fieldErrors.systemPrompt}</Text> : null}

          {/* Context ingestion */}
          <SectionLabel>Add context (optional)</SectionLabel>
          <Text className="text-xs text-zinc-400 mb-3">Ground the agent in specific course materials or trusted curriculum content.</Text>

          {/* Tab bar */}
          <View className="flex-row bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-1 mb-4">
            {(["library", "file", "youtube", "url"] as const).map((tab) => {
              const labels = { library: "📚 Library", file: "📄 File", youtube: "▶️ YouTube", url: "🌐 URL" };
              return (
                <Pressable key={tab} onPress={() => setActiveContextTab(tab)}
                  className={`flex-1 py-2 rounded-xl items-center ${activeContextTab === tab ? "bg-white dark:bg-zinc-700 shadow-sm" : ""}`}>
                  <Text className={`text-xs font-medium ${activeContextTab === tab ? "text-zinc-900 dark:text-white" : "text-zinc-500"}`}>{labels[tab]}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Library tab */}
          {activeContextTab === "library" && (
            <View>
              {/* Subject filter */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }} className="mb-3">
                {LIBRARY_SUBJECTS.map((s) => (
                  <Pressable key={s} onPress={() => setLibrarySubject(s)}
                    className={`rounded-full px-3 py-1.5 border ${libraryFilterSubject === s ? "bg-indigo-600 border-indigo-600" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"}`}>
                    <Text className={`text-xs font-medium ${libraryFilterSubject === s ? "text-white" : "text-zinc-600 dark:text-zinc-300"}`}>{s}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text className="text-xs text-zinc-400 mb-2">
                Showing Grade {currentGradeNum} · {libraryFilterSubject} · {libraryEntries.length} topic{libraryEntries.length !== 1 ? "s" : ""}
              </Text>

              {/* Curriculum entries */}
              {libraryEntries.length === 0 ? (
                <View className="bg-white dark:bg-zinc-900 rounded-2xl p-4 items-center border border-zinc-100 dark:border-zinc-800">
                  <Text className="text-zinc-400 text-sm text-center">No entries for this subject and grade. Try a different subject or grade.</Text>
                </View>
              ) : (
                <View className="gap-2 mb-4">
                  {libraryEntries.map((entry) => {
                    const added = addedIds.has(entry.title);
                    return (
                      <View key={entry.id} className="bg-white dark:bg-zinc-900 rounded-2xl px-4 py-3 border border-zinc-100 dark:border-zinc-800 flex-row items-start gap-3">
                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-zinc-900 dark:text-white mb-0.5">{entry.title}</Text>
                          <Text className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{entry.description}</Text>
                          <View className="flex-row items-center gap-1">
                            <Text className="text-xs">🏛️</Text>
                            <Text className="text-xs text-indigo-500 font-medium" numberOfLines={1}>{entry.source.split(" and ")[0]}</Text>
                          </View>
                        </View>
                        <Pressable onPress={() => addLibraryEntry(entry)} disabled={added}
                          className={`rounded-xl px-3 py-2 mt-0.5 ${added ? "bg-emerald-50 dark:bg-emerald-900/30" : "bg-indigo-600"}`}>
                          <Text className={`text-xs font-semibold ${added ? "text-emerald-600" : "text-white"}`}>{added ? "✓ Added" : "Add"}</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Trusted sources quick-fetch */}
              {trustedSources.length > 0 && (
                <>
                  <Text className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">🌐 Fetch from trusted source</Text>
                  <View className="gap-2">
                    {trustedSources.map((ts) => (
                      <View key={ts.id} className="bg-white dark:bg-zinc-900 rounded-2xl px-4 py-3 border border-zinc-100 dark:border-zinc-800 flex-row items-start gap-3">
                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-zinc-900 dark:text-white mb-0.5">{ts.title}</Text>
                          <Text className="text-xs text-zinc-500 mb-1">{ts.description}</Text>
                          <View className="flex-row gap-2">
                            <View className="bg-emerald-50 dark:bg-emerald-900/30 rounded-full px-2 py-0.5">
                              <Text className="text-xs text-emerald-700 font-medium">{ts.badge}</Text>
                            </View>
                            <Text className="text-xs text-zinc-400">{ts.organization}</Text>
                          </View>
                        </View>
                        <Pressable onPress={() => handleURLExtract(ts.url)} disabled={extracting}
                          className="bg-zinc-100 dark:bg-zinc-700 rounded-xl px-3 py-2 mt-0.5">
                          {extracting ? <ActivityIndicator size="small" color="#4f46e5" /> : <Text className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">Fetch</Text>}
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
          )}

          {/* File tab */}
          {activeContextTab === "file" && (
            <Pressable onPress={handleFilePick} disabled={extracting}
              className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-600 rounded-2xl py-6 items-center justify-center active:scale-95">
              {extracting ? <ActivityIndicator color="#4f46e5" /> : (
                <>
                  <Text className="text-3xl mb-2">📎</Text>
                  <Text className="text-zinc-700 dark:text-zinc-300 font-medium">Upload PDF or DOCX</Text>
                  <Text className="text-zinc-400 text-xs mt-1">Tap to browse files</Text>
                </>
              )}
            </Pressable>
          )}

          {/* YouTube / URL tabs */}
          {(activeContextTab === "youtube" || activeContextTab === "url") && (
            <View className="flex-row gap-2">
              <TextInput value={urlInput} onChangeText={setUrlInput}
                placeholder={activeContextTab === "youtube" ? "https://youtube.com/watch?v=..." : "https://example.com/article"}
                placeholderTextColor="#a1a1aa" autoCapitalize="none" keyboardType="url"
                className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3.5 text-base text-zinc-900 dark:text-white" />
              <Pressable onPress={() => handleURLExtract()} disabled={extracting || !urlInput.trim()}
                className="bg-indigo-600 rounded-2xl px-4 items-center justify-center active:scale-95" style={{ opacity: !urlInput.trim() ? 0.5 : 1 }}>
                {extracting ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-semibold">Extract</Text>}
              </Pressable>
            </View>
          )}

          {/* Extract error */}
          {extractError ? (
            <View className="mt-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              <Text className="text-red-600 dark:text-red-400 text-sm">{extractError}</Text>
            </View>
          ) : null}

          {/* Added sources list */}
          {sources.length > 0 && (
            <View className="mt-4 gap-2">
              <Text className="text-xs text-zinc-500 font-medium">
                Added sources · {contextCharCount.toLocaleString()} chars{contextCharCount > 18000 ? " (truncated to fit limit)" : ""}
              </Text>
              {sources.map((s, i) => (
                <View key={i} className="flex-row items-center bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-3 py-2.5">
                  <Text className="text-base mr-2">
                    {s.type === "pdf" ? "📄" : s.type === "docx" ? "📝" : s.type === "youtube" ? "▶️" : s.type === "library" ? "📚" : "🌐"}
                  </Text>
                  <Text className="flex-1 text-sm text-zinc-700 dark:text-zinc-300" numberOfLines={1}>{s.label}</Text>
                  <Pressable onPress={() => removeSource(i)} hitSlop={8} className="ml-2">
                    <Text className="text-red-400 text-lg leading-none">×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {/* Form error */}
          {formError ? (
            <View style={{ marginTop: 16, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12 }} className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
              <Text style={{ fontSize: 14, fontWeight: "500" }} className="text-red-600 dark:text-red-400">{formError}</Text>
            </View>
          ) : null}

          {/* Save */}
          <View style={{ marginTop: 32, marginBottom: 8, paddingTop: 24, borderTopWidth: 1, borderTopColor: "#f4f4f5" }}>
            <Pressable onPress={handleSave} disabled={saving}
              style={({ pressed }) => ({
                backgroundColor: "#4338ca",
                borderRadius: 18,
                paddingVertical: 18,
                alignItems: "center",
                justifyContent: "center",
                opacity: saving ? 0.7 : pressed ? 0.9 : 1,
                shadowColor: "#4338ca",
                shadowOpacity: 0.35,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 8,
              })}>
              {saving
                ? <ActivityIndicator color="white" />
                : <Text style={{ color: "white", fontWeight: "800", fontSize: 16, letterSpacing: 0.3 }}>Create Agent</Text>
              }
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <View style={{ flex: 1, height: 1 }} className="bg-zinc-200 dark:bg-zinc-700" />
      <Text style={{ fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase" }} className="text-zinc-400 dark:text-zinc-500">
        {children}
      </Text>
      <View style={{ flex: 1, height: 1 }} className="bg-zinc-200 dark:bg-zinc-700" />
    </View>
  );
}

function generateToken(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
