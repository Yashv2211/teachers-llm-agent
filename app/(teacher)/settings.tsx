import { db } from "@/lib/db";
import * as Haptics from "expo-haptics";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { user } = db.useAuth();

  function handleSignOut() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          db.auth.signOut();
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-nuru-bg-light dark:bg-nuru-bg" edges={["top"]}>
      <View className="px-5 pt-4 pb-3">
        <Text className="text-3xl font-bold text-nuru-text-light dark:text-nuru-text">
          Settings
        </Text>
      </View>

      <View className="px-5 mt-2">
        {/* Account card */}
        <View className="bg-nuru-surface-light dark:bg-nuru-surface rounded-2xl border border-nuru-border-light dark:border-nuru-border overflow-hidden mb-4">
          <View className="px-4 py-4 border-b border-nuru-border-light dark:border-nuru-border">
            <Text className="text-xs font-semibold text-nuru-secondary-light dark:text-nuru-secondary uppercase tracking-wide mb-3">
              Account
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-nuru-primary items-center justify-center">
                <Text style={{ color: "#0B1929", fontWeight: "700", fontSize: 16 }}>
                  {user?.email?.[0]?.toUpperCase() ?? "T"}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-nuru-text-light dark:text-nuru-text">
                  {user?.email ?? "Teacher"}
                </Text>
                <Text className="text-xs text-nuru-secondary-light dark:text-nuru-secondary">Signed in</Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={handleSignOut}
            className="px-4 py-4 active:bg-nuru-elevated-light dark:active:bg-nuru-elevated"
          >
            <Text className="text-nuru-error font-medium">Sign out</Text>
          </Pressable>
        </View>

        {/* About card */}
        <View className="bg-nuru-surface-light dark:bg-nuru-surface rounded-2xl border border-nuru-border-light dark:border-nuru-border overflow-hidden">
          <View className="px-4 py-4 border-b border-nuru-border-light dark:border-nuru-border">
            <Text className="text-xs font-semibold text-nuru-secondary-light dark:text-nuru-secondary uppercase tracking-wide mb-1">
              About Nuru
            </Text>
          </View>
          <View className="px-4 py-4 gap-3">
            <Row label="Voice engine" value="Web Speech API (free)" />
            <Row label="AI model" value="Llama 3.1 via Groq" />
            <Row label="Storage" value="InstantDB" />
            <Row label="Cost" value="Near-zero ✓" />
          </View>
        </View>

        <Text className="text-center text-xs text-nuru-secondary-light dark:text-nuru-secondary mt-6">
          Built for teachers in resource-limited settings.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-sm text-nuru-secondary-light dark:text-nuru-secondary">{label}</Text>
      <Text className="text-sm font-medium text-nuru-muted-light dark:text-nuru-muted">{value}</Text>
    </View>
  );
}
