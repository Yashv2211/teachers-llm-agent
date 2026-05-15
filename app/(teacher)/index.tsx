import { db } from "@/lib/db";
import { AppSchema } from "@/instant.schema";
import { InstaQLEntity } from "@instantdb/react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

type Agent = InstaQLEntity<AppSchema, "agents">;

const SUBJECT_EMOJI: Record<string, string> = {
  Mathematics: "📐",
  Science: "🔬",
  English: "📖",
  History: "🏛️",
  Geography: "🌍",
};

const SUBJECT_ACCENT: Record<string, string> = {
  Mathematics: "#3b82f6",
  Science: "#10b981",
  English: "#F59E0B",
  History: "#f59e0b",
  Geography: "#22c55e",
};

function useOffline() {
  const [offline, setOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return offline;
}

export default function DashboardScreen() {
  const { user } = db.useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const { isLoading, error, data } = db.useQuery(
    user
      ? {
          agents: {
            $: {
              where: { "teacher.id": user.id },
              order: { createdAt: "desc" },
            },
          },
        }
      : null
  );

  const agents: Agent[] = data?.agents ?? [];
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const offline = useOffline();

  function handleDeleteConfirm(agent: Agent) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    db.transact(db.tx.agents[agent.id].delete());
    setDeletingId(null);
  }

  return (
    <SafeAreaView className="flex-1 bg-nuru-bg-light dark:bg-nuru-bg" edges={["top"]}>
      {/* Offline banner */}
      {offline && (
        <View style={{ backgroundColor: "#f59e0b", paddingVertical: 8, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="cloud-offline-outline" size={16} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>You're offline — changes won't save</Text>
        </View>
      )}

      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: "#F59E0B",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Teacher Dashboard
        </Text>
        <Text
          style={{ fontSize: 30, fontWeight: "800", letterSpacing: -0.8 }}
          className="text-nuru-text-light dark:text-nuru-text"
        >
          My Agents
        </Text>
        <Text style={{ fontSize: 13, marginTop: 4 }} className="text-nuru-secondary-light dark:text-nuru-secondary">
          {isLoading
            ? "Loading…"
            : agents.length === 0
            ? "No agents created yet"
            : `${agents.length} voice agent${agents.length !== 1 ? "s" : ""}`}
        </Text>
      </View>

      {error ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <Text style={{ fontSize: 32, marginBottom: 12 }}>⚠️</Text>
          <Text style={{ fontSize: 16, fontWeight: "700", textAlign: "center", marginBottom: 8 }} className="text-nuru-text-light dark:text-nuru-text">
            Couldn't load your tutors
          </Text>
          <Text style={{ fontSize: 14, textAlign: "center", marginBottom: 24 }} className="text-zinc-500 dark:text-zinc-400">
            Check your connection and try again.
          </Text>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setRetryCount((c) => c + 1); }}
            style={{ backgroundColor: "#F59E0B", borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12 }}
          >
            <Text style={{ color: "#0B1929", fontWeight: "700", fontSize: 14 }}>Try again</Text>
          </Pressable>
        </View>
      ) : isLoading ? (
        <View style={{ padding: 16, gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : agents.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 26,
              backgroundColor: "#1E3050",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 42 }}>🤖</Text>
          </View>
          <Text
            style={{ fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 8, letterSpacing: -0.3 }}
            className="text-nuru-text-light dark:text-nuru-text"
          >
            No agents yet
          </Text>
          <Text style={{ fontSize: 14, textAlign: "center", lineHeight: 22, marginBottom: 28 }} className="text-zinc-500 dark:text-zinc-400">
            Create your first voice agent and share it with your students.
          </Text>
          <Pressable
            onPress={() => router.push("/(teacher)/create")}
            style={{
              backgroundColor: "#F59E0B",
              borderRadius: 16,
              paddingHorizontal: 28,
              paddingVertical: 14,
              shadowColor: "#F59E0B",
              shadowOpacity: 0.4,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 8,
            }}
          >
            <Text style={{ color: "#0B1929", fontWeight: "700", fontSize: 15 }}>Create Your First Agent</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={agents}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
            renderItem={({ item }) => (
              <AgentCard
                agent={item}
                isConfirming={deletingId === item.id}
                onPress={() => router.push(`/(teacher)/agents/${item.id}`)}
                onDeleteStart={() => setDeletingId(item.id)}
                onDeleteCancel={() => setDeletingId(null)}
                onDeleteConfirm={() => handleDeleteConfirm(item)}
              />
            )}
          />

          {/* FAB */}
          <View style={{ position: "absolute", bottom: 24, right: 20, zIndex: 10 }}>
            <Pressable
              onPress={() => router.push("/(teacher)/create")}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#F59E0B",
                borderRadius: 18,
                paddingHorizontal: 22,
                paddingVertical: 15,
                shadowColor: "#F59E0B",
                shadowOpacity: 0.45,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
                elevation: 10,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              })}
            >
              <Ionicons name="add" size={22} color="#0B1929" />
              <Text style={{ color: "#0B1929", fontWeight: "700", fontSize: 15, letterSpacing: 0.2 }}>
                New Agent
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function SkeletonCard() {
  return (
    <View
      style={{ borderRadius: 20, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2, flexDirection: "row" }}
      className="bg-nuru-surface-light dark:bg-nuru-surface"
    >
      <View style={{ width: 4 }} className="bg-nuru-border-light dark:bg-nuru-border" />
      <View style={{ flex: 1, padding: 16, gap: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ width: 46, height: 46, borderRadius: 14 }} className="bg-nuru-elevated-light dark:bg-nuru-elevated" />
          <View style={{ flex: 1, gap: 6 }}>
            <View style={{ height: 14, borderRadius: 7, width: "60%" }} className="bg-nuru-elevated-light dark:bg-nuru-elevated" />
            <View style={{ height: 11, borderRadius: 6, width: "35%" }} className="bg-nuru-elevated-light dark:bg-nuru-elevated" />
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <View style={{ height: 22, borderRadius: 8, width: 72 }} className="bg-nuru-elevated-light dark:bg-nuru-elevated" />
          <View style={{ height: 22, borderRadius: 8, width: 58 }} className="bg-nuru-elevated-light dark:bg-nuru-elevated" />
        </View>
      </View>
    </View>
  );
}

function AgentCard({
  agent,
  isConfirming,
  onPress,
  onDeleteStart,
  onDeleteCancel,
  onDeleteConfirm,
}: {
  agent: Agent;
  isConfirming: boolean;
  onPress: () => void;
  onDeleteStart: () => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
}) {
  const accent = SUBJECT_ACCENT[agent.subject] ?? "#F59E0B";
  const emoji = SUBJECT_EMOJI[agent.subject] ?? "🤖";

  const gradeLabel = (g: string) => {
    const n = parseInt(g, 10);
    if (!isNaN(n)) return `Grade ${n}`;
    const bands: Record<string, string> = { elementary: "Elementary", middle: "Middle School", high: "High School" };
    return bands[g] ?? g;
  };

  return (
    <Pressable
      onPress={isConfirming ? undefined : onPress}
      style={({ pressed }) => ({
        borderRadius: 20,
        overflow: "hidden",
        transform: [{ scale: pressed && !isConfirming ? 0.98 : 1 }],
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      })}
      className="bg-nuru-surface-light dark:bg-nuru-surface"
    >
      <View style={{ flexDirection: "row" }}>
        {/* Left accent strip */}
        <View style={{ width: 4, backgroundColor: accent }} />

        <View style={{ flex: 1, padding: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            {/* Subject emoji badge */}
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                backgroundColor: accent + "1a",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 22 }}>{emoji}</Text>
            </View>

            {/* Name + subject */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  letterSpacing: -0.3,
                  lineHeight: 22,
                }}
                className="text-nuru-text-light dark:text-nuru-text"
              >
                {agent.name}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: "600", color: accent, marginTop: 2 }}>
                {agent.subject}
              </Text>
            </View>

            {/* Actions */}
            {isConfirming ? (
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <Text style={{ fontSize: 11, fontWeight: "600" }} className="text-zinc-500 dark:text-zinc-400">Delete agent?</Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Pressable
                    onPress={onDeleteCancel}
                    style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}
                    className="bg-nuru-elevated-light dark:bg-nuru-elevated"
                  >
                    <Text style={{ fontSize: 12, fontWeight: "600" }} className="text-zinc-600 dark:text-zinc-300">
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={onDeleteConfirm}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 10,
                      backgroundColor: "#ef4444",
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Pressable
                  onPress={onDeleteStart}
                  hitSlop={8}
                  style={{ width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" }}
                  className="bg-red-50 dark:bg-red-950"
                >
                  <Ionicons name="trash-outline" size={15} color="#ef4444" />
                </Pressable>
                <Ionicons name="chevron-forward" size={16} color="#d4d4d8" />
              </View>
            )}
          </View>

          {/* Badges */}
          <View style={{ flexDirection: "row", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }} className="bg-nuru-elevated-light dark:bg-nuru-elevated">
              <Text style={{ fontSize: 11, fontWeight: "600" }} className="text-zinc-500 dark:text-zinc-400">
                {gradeLabel(agent.gradeLevel ?? "")}
              </Text>
            </View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }} className="bg-nuru-elevated-light dark:bg-nuru-elevated">
              <Text style={{ fontSize: 11, fontWeight: "600" }} className="text-zinc-500 dark:text-zinc-400">
                {agent.language}
              </Text>
            </View>
            {agent.contextText ? (
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }} className="bg-amber-50 dark:bg-amber-900/30">
                <Text style={{ fontSize: 11, fontWeight: "600" }} className="text-amber-800 dark:text-amber-300">📎 Context</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
