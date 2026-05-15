import { db } from "@/lib/db";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TeacherLayout() {
  const { user } = db.useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // index.tsx already waits for auth before redirecting here,
  // so we only need to guard against a logged-out state (e.g. sign-out)
  if (user === null) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F59E0B",
        tabBarInactiveTintColor: isDark ? "#7A8FA8" : "#6B7FA8",
        tabBarStyle: {
          backgroundColor: isDark ? "#0B1929" : "#F7F3EE",
          borderTopColor: isDark ? "#243652" : "#E2D9CE",
          borderTopWidth: 1,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Agents",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="layers-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "New Agent",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Hide agents/[id] from tab bar */}
      <Tabs.Screen
        name="agents/[id]"
        options={{ href: null }}
      />
    </Tabs>
  );
}
