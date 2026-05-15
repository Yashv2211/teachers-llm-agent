import { db } from "@/lib/db";
import { Redirect, router } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { isLoading, user } = db.useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0B1929" }}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(teacher)" />;
  }

  return <LandingPage />;
}

function LandingPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B1929" }} edges={["top", "bottom"]}>
      <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: "space-between", paddingTop: 48, paddingBottom: 32 }}>

        {/* Logo */}
        <View style={{ alignItems: "center" }}>
          <View style={{
            width: 56,
            height: 56,
            borderRadius: 9999,
            backgroundColor: "#F59E0B",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            shadowColor: "#F59E0B",
            shadowOpacity: 0.4,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 8 },
          }}>
            <Text style={{ fontSize: 24, fontWeight: "800", color: "#0B1929" }}>N</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#E8DDD0", letterSpacing: -0.5 }}>Nuru</Text>
        </View>

        {/* Hero */}
        <View style={{ alignItems: "center" }}>
          <Text style={{
            fontSize: 38,
            fontWeight: "800",
            color: "#E8DDD0",
            textAlign: "center",
            letterSpacing: -1.2,
            lineHeight: 46,
            marginBottom: 20,
          }}>
            Give every student{"\n"}a tutor.{" "}
            <Text style={{ color: "#F59E0B" }}>Free, forever.</Text>
          </Text>
          <Text style={{ fontSize: 16, color: "#7A8FA8", textAlign: "center", lineHeight: 26, maxWidth: 320 }}>
            Education without borders.
          </Text>
        </View>

        {/* Value props */}
        <View style={{ gap: 16 }}>
          <ValueProp
            icon="📱"
            text="Works on any phone, any connection — a QR code and no student account."
          />
          <ValueProp
            icon="📚"
            text="Your curriculum, your voice — every agent learns from what you actually teach."
          />
          <ValueProp
            icon="🎓"
            text="The individual attention you can't give 60 students. Nuru can."
          />
        </View>

        {/* CTA */}
        <View style={{ gap: 12 }}>
          <Pressable
            onPress={() => router.push("/(auth)/login")}
            style={({ pressed }) => ({
              backgroundColor: "#F59E0B",
              borderRadius: 9999,
              paddingVertical: 18,
              alignItems: "center",
              opacity: pressed ? 0.85 : 1,
              shadowColor: "#F59E0B",
              shadowOpacity: 0.4,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
            })}
          >
            <Text style={{ color: "#0B1929", fontWeight: "800", fontSize: 17, letterSpacing: 0.2 }}>
              Sign in as teacher
            </Text>
          </Pressable>
          <Text style={{ fontSize: 12, color: "#7A8FA8", textAlign: "center" }}>
            Free for teachers and students. Always.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

function ValueProp({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#152339",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <Text style={{ flex: 1, fontSize: 14, color: "#C8BEAF", lineHeight: 22, paddingTop: 8 }}>
        {text}
      </Text>
    </View>
  );
}
