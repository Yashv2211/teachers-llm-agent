import { db } from "@/lib/db";
import { AppSchema } from "@/instant.schema";
import { InstaQLEntity } from "@instantdb/react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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
  English: "#8b5cf6",
  History: "#f59e0b",
  Geography: "#22c55e",
};

export default function DashboardScreen() {
  const { user } = db.useAuth();
  const { isLoading, data } = db.useQuery(
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

  function handleDeleteConfirm(agent: Agent) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    db.transact(db.tx.agents[agent.id].delete());
    setDeletingId(null);
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-50 dark:bg-zinc-950" edges={["top"]}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: "#6366f1",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Teacher Dashboard
        </Text>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "800",
            color: "#18181b",
            letterSpacing: -0.8,
          }}
          className="dark:text-white"
        >
          My Agents
        </Text>
        <Text style={{ fontSize: 13, color: "#a1a1aa", marginTop: 4 }}>
          {agents.length === 0
            ? "No agents created yet"
            : `${agents.length} voice agent${agents.length !== 1 ? "s" : ""}`}
        </Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      ) : agents.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 26,
              backgroundColor: "#ede9fe",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 42 }}>🤖</Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#18181b",
              textAlign: "center",
              marginBottom: 8,
              letterSpacing: -0.3,
            }}
            className="dark:text-white"
          >
            No agents yet
          </Text>
          <Text style={{ fontSize: 14, color: "#71717a", textAlign: "center", lineHeight: 22, marginBottom: 28 }}>
            Create your first voice agent and share it with your students.
          </Text>
          <Pressable
            onPress={() => router.push("/(teacher)/create")}
            style={{
              backgroundColor: "#4338ca",
              borderRadius: 16,
              paddingHorizontal: 28,
              paddingVertical: 14,
              shadowColor: "#4338ca",
              shadowOpacity: 0.4,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Create Your First Agent</Text>
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
                backgroundColor: "#4338ca",
                borderRadius: 18,
                paddingHorizontal: 22,
                paddingVertical: 15,
                shadowColor: "#4338ca",
                shadowOpacity: 0.45,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
                elevation: 10,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              })}
            >
              <Ionicons name="add" size={22} color="white" />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 15, letterSpacing: 0.2 }}>
                New Agent
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
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
  const accent = SUBJECT_ACCENT[agent.subject] ?? "#4f46e5";
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
        backgroundColor: "#ffffff",
        borderRadius: 20,
        overflow: "hidden",
        transform: [{ scale: pressed && !isConfirming ? 0.98 : 1 }],
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      })}
      className="dark:bg-zinc-900"
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
                  color: "#18181b",
                  letterSpacing: -0.3,
                  lineHeight: 22,
                }}
                className="dark:text-white"
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
                <Text style={{ fontSize: 11, color: "#71717a", fontWeight: "600" }}>Delete agent?</Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Pressable
                    onPress={onDeleteCancel}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 10,
                      backgroundColor: "#f4f4f5",
                    }}
                    className="dark:bg-zinc-800"
                  >
                    <Text style={{ fontSize: 12, fontWeight: "600", color: "#52525b" }} className="dark:text-zinc-300">
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
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: "#fef2f2",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="dark:bg-red-950"
                >
                  <Ionicons name="trash-outline" size={15} color="#ef4444" />
                </Pressable>
                <Ionicons name="chevron-forward" size={16} color="#d4d4d8" />
              </View>
            )}
          </View>

          {/* Badges */}
          <View style={{ flexDirection: "row", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
            <View
              style={{
                backgroundColor: "#f4f4f5",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
              }}
              className="dark:bg-zinc-800"
            >
              <Text style={{ fontSize: 11, fontWeight: "600", color: "#71717a" }} className="dark:text-zinc-400">
                {gradeLabel(agent.gradeLevel ?? "")}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#f4f4f5",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
              }}
              className="dark:bg-zinc-800"
            >
              <Text style={{ fontSize: 11, fontWeight: "600", color: "#71717a" }} className="dark:text-zinc-400">
                {agent.language}
              </Text>
            </View>
            {agent.contextText ? (
              <View
                style={{
                  backgroundColor: "#fef9ec",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: "600", color: "#92400e" }}>📎 Context</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
