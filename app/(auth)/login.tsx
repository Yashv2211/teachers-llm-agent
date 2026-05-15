import { db } from "@/lib/db";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);

  async function handleSendCode() {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await db.auth.sendMagicCode({ email: email.trim() });
      setStep("code");
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to send code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode() {
    if (!code.trim()) return;
    setLoading(true);
    try {
      await db.auth.signInWithMagicCode({ email: email.trim(), code: code.trim() });
    } catch (err: any) {
      Alert.alert("That code doesn't match", "Try again.");
      setLoading(false);
    }
  }

  function handleSignIn() {
    if (step === "email") handleSendCode();
    else handleVerifyCode();
  }

  return (
    <SafeAreaView className="flex-1 bg-nuru-bg-light dark:bg-nuru-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 items-center justify-center px-8">
          {/* Nuru wordmark */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 9999,
              backgroundColor: "#F59E0B",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              shadowColor: "#F59E0B",
              shadowOpacity: 0.4,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 8 },
            }}>
              <Text style={{ fontSize: 28, fontWeight: "800", color: "#0B1929", letterSpacing: -1 }}>N</Text>
            </View>
            <Text style={{ fontSize: 36, fontWeight: "800", letterSpacing: -1.5, color: "#0B1929" }} className="dark:text-nuru-text">
              Nuru
            </Text>
          </View>

          {/* Headline */}
          <Text style={{ fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 6, letterSpacing: -0.3 }} className="text-nuru-text-light dark:text-nuru-text">
            Welcome to Nuru
          </Text>
          <Text style={{ fontSize: 15, textAlign: "center", marginBottom: 32, lineHeight: 22 }} className="text-nuru-secondary-light dark:text-nuru-secondary">
            {step === "email"
              ? "Enter your email to get started — no password required."
              : `Check your email for a 6-digit code.`}
          </Text>

          {/* Input */}
          <View className="w-full mb-3">
            {step === "email" ? (
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Your email address"
                placeholderTextColor="#7A8FA8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                onSubmitEditing={handleSendCode}
                className="w-full bg-nuru-surface-light dark:bg-nuru-surface border border-nuru-border-light dark:border-nuru-border rounded-2xl px-4 py-4 text-base text-nuru-text-light dark:text-nuru-text"
              />
            ) : (
              <>
                <Text style={{ fontSize: 13, textAlign: "center", marginBottom: 12 }} className="text-nuru-secondary-light dark:text-nuru-secondary">
                  Sent to{" "}
                  <Text style={{ fontWeight: "700" }} className="text-nuru-text-light dark:text-nuru-text">{email}</Text>
                </Text>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="000000"
                  placeholderTextColor="#7A8FA8"
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                  onSubmitEditing={handleVerifyCode}
                  className="w-full bg-nuru-surface-light dark:bg-nuru-surface border border-nuru-border-light dark:border-nuru-border rounded-2xl px-4 py-4 text-2xl text-center tracking-widest text-nuru-text-light dark:text-nuru-text"
                />
              </>
            )}
          </View>

          {/* CTA button */}
          <Pressable
            disabled={loading || (step === "email" ? !email.trim() : !code.trim())}
            onPress={handleSignIn}
            style={({ pressed }) => ({
              width: "100%",
              backgroundColor: "#F59E0B",
              borderRadius: 9999,
              paddingVertical: 16,
              alignItems: "center",
              justifyContent: "center",
              opacity: loading || (step === "email" ? !email.trim() : !code.trim()) ? 0.5 : pressed ? 0.85 : 1,
              shadowColor: "#F59E0B",
              shadowOpacity: 0.35,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
            })}
          >
            {loading ? (
              <ActivityIndicator color="#0B1929" />
            ) : (
              <Text style={{ color: "#0B1929", fontWeight: "700", fontSize: 16 }}>
                {step === "email" ? "Send Code" : "Sign In"}
              </Text>
            )}
          </Pressable>

          {step === "code" && (
            <Pressable onPress={() => { setStep("email"); setCode(""); }} style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 14 }} className="text-nuru-primary">
                Send a new code
              </Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
