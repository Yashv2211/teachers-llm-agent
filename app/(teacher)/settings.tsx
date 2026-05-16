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
    <SafeAreaView className="flex-1 bg-zinc-50 dark:bg-zinc-950" edges={["top"]}>
      <View className="px-5 pt-4 pb-3">
        <Text className="text-3xl font-bold text-zinc-900 dark:text-white">
          Settings
        </Text>
      </View>

      <View className="px-5 mt-2">
        {/* Account card */}
        <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden mb-4">
          <View className="px-4 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <Text className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
              Account
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-[#0b1e36] border border-[#7ba7c9] items-center justify-center">
                <Text className="text-white font-bold text-base">
                  {user?.email?.[0]?.toUpperCase() ?? "T"}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-zinc-900 dark:text-white">
                  {user?.email ?? "Teacher"}
                </Text>
                <Text className="text-xs text-zinc-400">Signed in</Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={handleSignOut}
            className="px-4 py-4 active:bg-zinc-50 dark:active:bg-zinc-800"
          >
            <Text className="text-red-500 font-medium">Sign out</Text>
          </Pressable>
        </View>

        {/* About card */}
        <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <View className="px-4 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <Text className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
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

        <Text className="text-center text-xs text-zinc-400 mt-6">
          Built for teachers in resource-limited settings.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-sm text-zinc-500 dark:text-zinc-400">{label}</Text>
      <Text className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{value}</Text>
    </View>
  );
}
