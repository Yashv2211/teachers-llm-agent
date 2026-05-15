import { db } from "@/lib/db";
import { AppSchema } from "@/instant.schema";
import { summarizeQuestions } from "@/lib/groq";
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
import { InstaQLEntity } from "@instantdb/react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useCallback } from "react";
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
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

type Agent = InstaQLEntity<AppSchema, "agents">;

const GRADE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];


export default function AgentDetailScreen() {
  const { id: agentId } = useLocalSearchParams<{ id: string }>();
  const { user } = db.useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const retry = useCallback(() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setRetryCount((c) => c + 1); }, []);

  const { isLoading, error, data } = db.useQuery(
    agentId ? { agents: { $: { where: { id: agentId } } } } : null
  );

  const agent: Agent | undefined = data?.agents?.[0];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-nuru-bg-light dark:bg-nuru-bg">
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-8">
        <Text style={{ fontSize: 32, marginBottom: 12 }}>⚠️</Text>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#18181b", textAlign: "center", marginBottom: 8 }}>
          {"Couldn't load this tutor"}
        </Text>
        <Text style={{ fontSize: 14, color: "#71717a", textAlign: "center", marginBottom: 24 }}>
          Check your connection and try again.
        </Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable onPress={retry} style={{ backgroundColor: "#F59E0B", borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12 }}>
            <Text style={{ color: "#0B1929", fontWeight: "700", fontSize: 14 }}>Try again</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={{ borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12, borderWidth: 1, borderColor: "#e4e4e7" }}>
            <Text style={{ color: "#71717a", fontWeight: "600", fontSize: 14 }}>Go back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!agent) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-8">
        <Text className="text-zinc-500 text-center">Agent not found.</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-nuru-primary font-semibold">Go back</Text>
        </Pressable>
      </View>
    );
  }

  return <AgentEditor agent={agent} userId={user?.id} />;
}

function AgentEditor({ agent, userId }: { agent: Agent; userId?: string }) {
  const [name, setName] = useState(agent.name);
  const [subject, setSubject] = useState(agent.subject);
  const [systemPrompt, setSystemPrompt] = useState(agent.systemPrompt);
  const [gradeLevel, setGradeLevel] = useState(agent.gradeLevel ?? "6");
  const [language, setLanguage] = useState(agent.language);

  const existingSources: ContextSource[] = agent.contextSources
    ? (JSON.parse(agent.contextSources) as { type: any; label: string }[]).map(
        (s) => ({ ...s, text: "" })
      )
    : [];

  const [sources, setSources] = useState<ContextSource[]>(existingSources);
  const [extracting, setExtracting] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [activeContextTab, setActiveContextTab] = useState<"file" | "youtube" | "url" | "library">("library");
  const [librarySubject, setLibrarySubject] = useState(agent.subject ?? "");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; subject?: string; systemPrompt?: string }>({});
  const [extractError, setExtractError] = useState("");
  const [copied, setCopied] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  const { isLoading: logLoading, data: logData } = db.useQuery({
    questionLog: {
      $: { where: { agentId: agent.id }, order: { createdAt: "desc" }, limit: 50 },
    },
  });
  const questions = logData?.questionLog ?? [];

  async function handleSummarize() {
    if (questions.length === 0) return;
    setSummarizing(true);
    setSummary(null);
    try {
      const result = await summarizeQuestions(
        questions.map((q) => q.question),
        agent.subject,
        agent.name
      );
      setSummary(result);
    } catch {
      setSummary("Could not generate summary. Please try again.");
    } finally {
      setSummarizing(false);
    }
  }

  const shareLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/student/${agent.shareToken}`
      : `https://yourapp.com/student/${agent.shareToken}`;

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

  async function handleDelete() {
    setDeleting(true);
    try {
      await db.transact(db.tx.agents[agent.id].delete());
      router.back();
    } catch (err: any) {
      setFormError(err?.message ?? "Delete failed. Please try again.");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  async function copyLink() {
    await Clipboard.setStringAsync(shareLink);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
        if (!file) { setExtractError("File extraction requires the web browser."); return; }
        if (file.size > 10 * 1024 * 1024) { setExtractError("File too large — max 10MB. Try a smaller document."); return; }
        const ext = asset.name.split(".").pop()?.toLowerCase();
        let text = "";
        if (ext === "pdf") text = await extractTextFromPDF(file);
        else if (ext === "docx") text = await extractTextFromDOCX(file);
        else { setExtractError("Please upload a PDF or DOCX."); return; }
        if (!text.trim()) { setExtractError("File appears empty or contains only images."); return; }
        setSources((p) => [...p, { type: ext as "pdf" | "docx", label: asset.name, text }]);
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
        label = `YouTube: ${extractYouTubeVideoId(url)}`;
        text = await extractYouTubeTranscript(url);
      } else {
        label = new URL(url).hostname;
        text = await extractTextFromURL(url);
      }
      if (!text.trim()) { setExtractError("Couldn't extract readable text from that URL."); return; }
      setSources((p) => [...p, { type: isYouTube ? "youtube" : "url", label, text }]);
      if (!overrideUrl) setUrlInput("");
      setExtractError("");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      setExtractError(err?.message ?? "Failed to extract URL content.");
    } finally { setExtracting(false); }
  }

  function removeSource(i: number) {
    setSources((p) => p.filter((_, idx) => idx !== i));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async function handleSave() {
    setFormError("");
    const errs: typeof fieldErrors = {};
    if (!name.trim()) errs.name = "Agent name is required.";
    if (!subject.trim()) errs.subject = "Subject is required.";
    if (!systemPrompt.trim()) errs.systemPrompt = "Agent instructions are required.";
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaving(true);
    try {
      const newSources = sources.filter((s) => s.text.length > 0);
      const contextText = newSources.length > 0 ? combineAndTruncate(newSources) : agent.contextText;
      const contextSources = newSources.length > 0
        ? JSON.stringify(newSources.map((s) => ({ type: s.type, label: s.label })))
        : agent.contextSources;

      await db.transact(
        db.tx.agents[agent.id].update({
          name: name.trim(), subject: subject.trim(), systemPrompt: systemPrompt.trim(),
          gradeLevel, language,
          ...(contextText ? { contextText } : {}),
          ...(contextSources ? { contextSources } : {}),
        })
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setFormError(err?.message ?? "Save failed. Please try again.");
    } finally { setSaving(false); }
  }

  return (
    <SafeAreaView className="flex-1 bg-nuru-bg-light dark:bg-nuru-bg" edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">

          {/* Back + header */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
            <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back" style={{ marginRight: 10, padding: 4 }}>
              <Ionicons name="chevron-back" size={22} color="#F59E0B" />
            </Pressable>
            <Text style={{ flex: 1, fontSize: 20, fontWeight: "800", letterSpacing: -0.5 }} className="text-nuru-text-light dark:text-nuru-text" numberOfLines={1}>
              {agent.name}
            </Text>
            {confirmDelete ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Pressable onPress={() => setConfirmDelete(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel delete"
                  style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, backgroundColor: "#f4f4f5" }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#52525b" }}>Cancel</Text>
                </Pressable>
                <Pressable onPress={handleDelete} disabled={deleting}
                  accessibilityRole="button"
                  accessibilityLabel="Confirm delete"
                  accessibilityState={{ disabled: deleting }}
                  style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, backgroundColor: "#ef4444" }}>
                  {deleting
                    ? <ActivityIndicator size="small" color="#fff" />
                    : <Text style={{ fontSize: 13, fontWeight: "700", color: "#fff" }}>Delete</Text>}
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={() => setConfirmDelete(true)}
                accessibilityRole="button"
                accessibilityLabel="Delete agent"
                style={{ padding: 8, borderRadius: 10, backgroundColor: "#fef2f2" }}>
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </Pressable>
            )}
          </View>

          {/* Share card — dark premium */}
          <View style={{ backgroundColor: "#0B1929", borderRadius: 24, overflow: "hidden", marginBottom: 28, borderWidth: 1, borderColor: "#243652" }}>
            <View style={{ alignItems: "center", paddingTop: 28, paddingBottom: 20, paddingHorizontal: 20 }}>
              <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
                Student Access
              </Text>
              <View style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 16 }}>
                <QRCode value={shareLink} size={148} />
              </View>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 14, textAlign: "center" }}>
                Students scan to open their session
              </Text>
            </View>
            <View style={{ backgroundColor: "rgba(0,0,0,0.3)", paddingHorizontal: 20, paddingVertical: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Text style={{ flex: 1, color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "monospace" }} numberOfLines={1}>
                {shareLink}
              </Text>
              <Pressable onPress={copyLink}
                accessibilityRole="button"
                accessibilityLabel={copied ? "Link copied" : "Copy share link"}
                style={{ backgroundColor: copied ? "#10b981" : "rgba(255,255,255,0.15)", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>{copied ? "Copied!" : "Copy"}</Text>
              </Pressable>
            </View>
          </View>

          {/* Edit fields */}
          <SectionLabel>Agent name</SectionLabel>
          <TextInput value={name} onChangeText={(v) => { setName(v); if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined })); }}
            accessibilityLabel="Agent name"
            style={{ marginBottom: fieldErrors.name ? 4 : 20, borderColor: fieldErrors.name ? "#ef4444" : undefined }}
            className="bg-nuru-surface-light dark:bg-nuru-surface border border-nuru-border-light dark:border-nuru-border rounded-2xl px-4 py-3.5 text-base text-nuru-text-light dark:text-nuru-text" />
          {fieldErrors.name ? <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 16, marginLeft: 4 }}>{fieldErrors.name}</Text> : null}

          <SectionLabel>Subject</SectionLabel>
          <TextInput value={subject} onChangeText={(v) => { setSubject(v); setLibrarySubject(v); if (fieldErrors.subject) setFieldErrors((p) => ({ ...p, subject: undefined })); }}
            accessibilityLabel="Subject"
            style={{ marginBottom: fieldErrors.subject ? 4 : 20, borderColor: fieldErrors.subject ? "#ef4444" : undefined }}
            className="bg-nuru-surface-light dark:bg-nuru-surface border border-nuru-border-light dark:border-nuru-border rounded-2xl px-4 py-3.5 text-base text-nuru-text-light dark:text-nuru-text" />
          {fieldErrors.subject ? <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 16, marginLeft: 4 }}>{fieldErrors.subject}</Text> : null}

          {/* Grade 1-12 grid */}
          <SectionLabel>Grade level</SectionLabel>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 20 }}>
            {GRADE_NUMBERS.map((g) => {
              const sel = gradeLevel === String(g);
              return (
                <Pressable key={g} onPress={() => { setGradeLevel(String(g)); Haptics.selectionAsync(); }}
                  accessibilityRole="button"
                  accessibilityLabel={`Grade ${g}`}
                  accessibilityState={{ selected: sel }}
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
                  <Text style={{ fontWeight: "700", fontSize: 15, color: sel ? "#0B1929" : "#52525b" }} className={sel ? "" : "dark:text-zinc-200"}>{g}</Text>
                </Pressable>
              );
            })}
          </View>

          <SectionLabel>Response language</SectionLabel>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }} style={{ marginBottom: 20 }}>
            {SUPPORTED_LANGUAGES.map(({ label: lang }) => {
              const sel = language === lang;
              return (
                <Pressable key={lang} onPress={() => { setLanguage(lang); Haptics.selectionAsync(); }}
                  accessibilityRole="button"
                  accessibilityLabel={lang}
                  accessibilityState={{ selected: sel }}
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
                  <Text style={{ fontSize: 13, fontWeight: "600", color: sel ? "#0B1929" : "#52525b" }} className={sel ? "" : "dark:text-zinc-300"}>{lang}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <SectionLabel>Agent instructions</SectionLabel>
          <TextInput value={systemPrompt} onChangeText={(v) => { setSystemPrompt(v); if (fieldErrors.systemPrompt) setFieldErrors((p) => ({ ...p, systemPrompt: undefined })); }} multiline numberOfLines={5} textAlignVertical="top"
            accessibilityLabel="Agent instructions"
            style={{ marginBottom: fieldErrors.systemPrompt ? 4 : 20, minHeight: 120, borderColor: fieldErrors.systemPrompt ? "#ef4444" : undefined }}
            className="bg-nuru-surface-light dark:bg-nuru-surface border border-nuru-border-light dark:border-nuru-border rounded-2xl px-4 py-3.5 text-base text-nuru-text-light dark:text-nuru-text" />
          {fieldErrors.systemPrompt ? <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 16, marginLeft: 4 }}>{fieldErrors.systemPrompt}</Text> : null}

          {/* Context */}
          <SectionLabel>Add more context</SectionLabel>
          <View className="flex-row bg-nuru-elevated-light dark:bg-nuru-elevated rounded-2xl p-1 mb-4">
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
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }} className="mb-3">
                {LIBRARY_SUBJECTS.map((s) => (
                  <Pressable key={s} onPress={() => setLibrarySubject(s)}
                    className={`rounded-full px-3 py-1.5 border ${libraryFilterSubject === s ? "bg-nuru-primary border-nuru-primary" : "bg-nuru-surface-light dark:bg-nuru-surface border-nuru-border-light dark:border-nuru-border"}`}>
                    <Text className={`text-xs font-medium ${libraryFilterSubject === s ? "text-nuru-on-primary" : "text-nuru-secondary-light dark:text-nuru-secondary"}`}>{s}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text className="text-xs text-zinc-400 mb-2">
                Grade {currentGradeNum} · {libraryFilterSubject} · {libraryEntries.length} topic{libraryEntries.length !== 1 ? "s" : ""}
              </Text>

              {libraryEntries.length === 0 ? (
                <View className="bg-nuru-surface-light dark:bg-nuru-surface rounded-2xl p-4 items-center border border-nuru-border-light dark:border-nuru-border">
                  <Text className="text-zinc-400 text-sm text-center">No entries for this subject and grade.</Text>
                </View>
              ) : (
                <View className="gap-2 mb-4">
                  {libraryEntries.map((entry) => {
                    const added = addedIds.has(entry.title);
                    return (
                      <View key={entry.id} className="bg-nuru-surface-light dark:bg-nuru-surface rounded-2xl px-4 py-3 border border-nuru-border-light dark:border-nuru-border flex-row items-start gap-3">
                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-zinc-900 dark:text-white mb-0.5">{entry.title}</Text>
                          <Text className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{entry.description}</Text>
                          <View className="flex-row items-center gap-1">
                            <Text className="text-xs">🏛️</Text>
                            <Text className="text-xs text-nuru-primary font-medium" numberOfLines={1}>{entry.source.split(" and ")[0]}</Text>
                          </View>
                        </View>
                        <Pressable onPress={() => addLibraryEntry(entry)} disabled={added}
                          className={`rounded-xl px-3 py-2 mt-0.5 ${added ? "bg-emerald-50 dark:bg-emerald-900/30" : "bg-nuru-primary"}`}>
                          <Text className={`text-xs font-semibold ${added ? "text-emerald-600" : "text-nuru-on-primary"}`}>{added ? "✓ Added" : "Add"}</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              )}

              {trustedSources.length > 0 && (
                <>
                  <Text className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">🌐 Fetch from trusted source</Text>
                  <View className="gap-2">
                    {trustedSources.map((ts) => (
                      <View key={ts.id} className="bg-nuru-surface-light dark:bg-nuru-surface rounded-2xl px-4 py-3 border border-nuru-border-light dark:border-nuru-border flex-row items-start gap-3">
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
                          {extracting ? <ActivityIndicator size="small" color="#F59E0B" /> : <Text className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">Fetch</Text>}
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
          )}

          {activeContextTab === "file" && (
            <Pressable onPress={handleFilePick} disabled={extracting}
              accessibilityRole="button"
              accessibilityLabel="Upload PDF or DOCX"
              accessibilityState={{ disabled: extracting }}
              className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-600 rounded-2xl py-6 items-center justify-center active:scale-95">
              {extracting ? <ActivityIndicator color="#F59E0B" /> : (
                <>
                  <Text className="text-3xl mb-2">📎</Text>
                  <Text className="text-zinc-700 dark:text-zinc-300 font-medium">Upload PDF or DOCX</Text>
                </>
              )}
            </Pressable>
          )}

          {(activeContextTab === "youtube" || activeContextTab === "url") && (
            <View className="flex-row gap-2">
              <TextInput value={urlInput} onChangeText={setUrlInput}
                placeholder={activeContextTab === "youtube" ? "https://youtube.com/watch?v=..." : "https://example.com/article"}
                placeholderTextColor="#a1a1aa" autoCapitalize="none" keyboardType="url"
                accessibilityLabel={activeContextTab === "youtube" ? "YouTube URL" : "Article URL"}
                className="flex-1 bg-nuru-surface-light dark:bg-nuru-surface border border-nuru-border-light dark:border-nuru-border rounded-2xl px-4 py-3.5 text-base text-nuru-text-light dark:text-nuru-text" />
              <Pressable onPress={() => handleURLExtract()} disabled={extracting || !urlInput.trim()}
                accessibilityRole="button"
                accessibilityLabel="Extract content"
                accessibilityState={{ disabled: extracting || !urlInput.trim() }}
                className="bg-nuru-primary rounded-2xl px-4 items-center justify-center active:scale-95" style={{ opacity: !urlInput.trim() ? 0.5 : 1 }}>
                {extracting ? <ActivityIndicator color="#0B1929" size="small" /> : <Text className="text-nuru-on-primary font-semibold">Extract</Text>}
              </Pressable>
            </View>
          )}

          {/* Extract error */}
          {extractError ? (
            <View className="mt-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              <Text className="text-red-600 dark:text-red-400 text-sm">{extractError}</Text>
            </View>
          ) : null}

          {sources.length > 0 && (
            <View className="mt-4 gap-2">
              <Text className="text-xs text-zinc-500 font-medium">Sources ({sources.length})</Text>
              {sources.map((s, i) => (
                <View key={i} className="flex-row items-center bg-nuru-surface-light dark:bg-nuru-surface border border-nuru-border-light dark:border-nuru-border rounded-xl px-3 py-2.5">
                  <Text className="text-base mr-2">
                    {s.type === "pdf" ? "📄" : s.type === "docx" ? "📝" : s.type === "youtube" ? "▶️" : s.type === "library" ? "📚" : "🌐"}
                  </Text>
                  <Text className="flex-1 text-sm text-zinc-700 dark:text-zinc-300" numberOfLines={1}>{s.label}</Text>
                  {s.text.length > 0 && (
                    <Pressable onPress={() => removeSource(i)} hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${s.label}`}
                      className="ml-2">
                      <Text className="text-red-400 text-lg leading-none">×</Text>
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Form error */}
          {formError ? (
            <View
              style={{ marginTop: 16, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12 }}
              className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
              accessibilityLiveRegion="assertive"
            >
              <Text style={{ fontSize: 14, fontWeight: "500" }} className="text-red-600 dark:text-red-400">{formError}</Text>
            </View>
          ) : null}

          {/* Save */}
          <View style={{ marginTop: 32, marginBottom: 8, paddingTop: 24, borderTopWidth: 1, borderTopColor: "#f4f4f5" }}>
            <Pressable onPress={handleSave} disabled={saving}
              accessibilityRole="button"
              accessibilityLabel={saved ? "Saved" : saving ? "Saving" : "Save changes"}
              accessibilityState={{ disabled: saving }}
              style={({ pressed }) => ({
                borderRadius: 18,
                paddingVertical: 18,
                alignItems: "center",
                justifyContent: "center",
                opacity: saving ? 0.7 : pressed ? 0.9 : 1,
                backgroundColor: saved ? "#059669" : "#4338ca",
                shadowColor: saved ? "#059669" : "#4338ca",
                shadowOpacity: 0.35,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 8,
              })}>
              {saving
                ? <ActivityIndicator color="#0B1929" />
                : <Text style={{ color: "#0B1929", fontWeight: "800", fontSize: 16, letterSpacing: 0.3 }}>{saved ? "✓ Saved!" : "Save Changes"}</Text>
              }
            </Pressable>
          </View>
          {/* Question Log */}
          <View style={{ marginTop: 36 }}>
            <SectionLabel>Student Questions</SectionLabel>

            {logLoading ? (
              <View style={{ gap: 10 }}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={{ height: 48, borderRadius: 14, backgroundColor: "#f4f4f5" }} />
                ))}
              </View>
            ) : questions.length === 0 ? (
              <View style={{ alignItems: "center", paddingVertical: 28, backgroundColor: "#152339", borderRadius: 18, borderWidth: 1, borderColor: "#243652" }}>
                <Text style={{ fontSize: 28, marginBottom: 8 }}>📭</Text>
                <Text style={{ fontSize: 14, color: "#7A8FA8", textAlign: "center" }}>
                  No questions yet — share the QR code with your students.
                </Text>
              </View>
            ) : (
              <>
                {/* Summarize button */}
                <Pressable
                  onPress={handleSummarize}
                  disabled={summarizing}
                  accessibilityRole="button"
                  accessibilityLabel={summarizing ? "Summarizing" : "Summarize with AI"}
                  accessibilityState={{ disabled: summarizing }}
                  style={({ pressed }) => ({
                    backgroundColor: summarizing ? "#1E3050" : pressed ? "#FBBF24" : "#F59E0B",
                    borderRadius: 14,
                    paddingVertical: 13,
                    alignItems: "center",
                    marginBottom: 16,
                    opacity: summarizing ? 0.8 : 1,
                  })}
                >
                  {summarizing ? (
                    <ActivityIndicator color="#F59E0B" size="small" />
                  ) : (
                    <Text style={{ color: "#0B1929", fontWeight: "700", fontSize: 14 }}>
                      ✨ Summarize with AI
                    </Text>
                  )}
                </Pressable>

                {/* Summary result */}
                {summary ? (
                  <View style={{ backgroundColor: "#152339", borderRadius: 14, borderWidth: 1, borderColor: "#243652", padding: 16, marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: "#F59E0B", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                      AI Summary
                    </Text>
                    <Text style={{ fontSize: 14, color: "#C8BEAF", lineHeight: 22 }}>{summary}</Text>
                  </View>
                ) : null}

                {/* Question list */}
                <View style={{ gap: 8 }}>
                  {questions.map((q) => (
                    <View
                      key={q.id}
                      style={{
                        backgroundColor: "#152339",
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: "#243652",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 10,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 1 },
                      }}
                    >
                      <Text style={{ fontSize: 16, marginTop: 1 }}>💬</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, color: "#E8DDD0", lineHeight: 20 }} numberOfLines={3}>
                          {q.question}
                        </Text>
                        <Text style={{ fontSize: 11, color: "#7A8FA8", marginTop: 4 }}>
                          {formatRelativeTime(q.createdAt)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                <Text style={{ fontSize: 11, color: "#243652", textAlign: "center", marginTop: 12 }}>
                  Showing last {questions.length} question{questions.length !== 1 ? "s" : ""}
                </Text>
              </>
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <View style={{ flex: 1, height: 1 }} className="bg-nuru-border-light dark:bg-nuru-border" />
      <Text style={{ fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase" }} className="text-zinc-400 dark:text-zinc-500">
        {children}
      </Text>
      <View style={{ flex: 1, height: 1 }} className="bg-nuru-border-light dark:bg-nuru-border" />
    </View>
  );
}
