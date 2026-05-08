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
      Alert.alert("Invalid code", "Please check the code and try again.");
      setLoading(false);
    }
  }

  function handleSignIn() {
    if (step === "email") handleSendCode();
    else handleVerifyCode();
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 items-center justify-center px-8">
          {/* Logo */}
          <View className="w-24 h-24 rounded-3xl bg-indigo-600 items-center justify-center mb-8 shadow-lg">
            <Text className="text-5xl">🎓</Text>
          </View>

          <Text className="text-4xl font-bold text-zinc-900 dark:text-white text-center mb-3">
            EduVoice
          </Text>
          <Text className="text-lg text-zinc-500 dark:text-zinc-400 text-center mb-2">
            AI voice agents for your classroom
          </Text>
          <Text className="text-sm text-zinc-400 dark:text-zinc-500 text-center mb-10 max-w-xs">
            Create interactive voice agents grounded in your course materials.
          </Text>

          {/* Input */}
          <View className="w-full mb-3">
            {step === "email" ? (
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Your email address"
                placeholderTextColor="#a1a1aa"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                onSubmitEditing={handleSendCode}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-4 text-base text-zinc-900 dark:text-white"
              />
            ) : (
              <>
                <Text className="text-sm text-zinc-500 text-center mb-3">
                  Enter the 6-digit code sent to{" "}
                  <Text className="font-semibold text-zinc-800 dark:text-zinc-200">{email}</Text>
                </Text>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="000000"
                  placeholderTextColor="#a1a1aa"
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                  onSubmitEditing={handleVerifyCode}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-4 text-2xl text-center tracking-widest text-zinc-900 dark:text-white"
                />
              </>
            )}
          </View>

          {/* CTA button */}
          <Pressable
            disabled={loading || (step === "email" ? !email.trim() : !code.trim())}
            onPress={handleSignIn}
            className="w-full bg-indigo-600 rounded-2xl py-4 items-center justify-center active:scale-95"
            style={{ opacity: loading || (step === "email" ? !email.trim() : !code.trim()) ? 0.6 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {step === "email" ? "Send Code" : "Sign In"}
              </Text>
            )}
          </Pressable>

          {step === "code" && (
            <Pressable onPress={() => { setStep("email"); setCode(""); }} className="mt-4">
              <Text className="text-sm text-indigo-600">Use a different email</Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
