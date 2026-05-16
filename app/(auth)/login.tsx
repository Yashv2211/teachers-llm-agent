import { db } from "@/lib/db";
import { Nuru } from "@/constants/Colors";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
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
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Logo mark */}
          <View style={styles.logoWrap}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>✦</Text>
            </View>
            <Text style={styles.logoTitle}>Nuru.</Text>
            <Text style={styles.logoSub}>The Ray of Hope</Text>
          </View>

          <Text style={styles.headline}>AI voice agents for your classroom</Text>
          <Text style={styles.subline}>
            Create interactive voice agents grounded in your course materials.
          </Text>

          {/* Input area */}
          <View style={styles.inputWrap}>
            {step === "email" ? (
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Your email address"
                placeholderTextColor={Nuru.inkLight}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                onSubmitEditing={handleSendCode}
                style={styles.input}
              />
            ) : (
              <>
                <Text style={styles.codeHint}>
                  Enter the 6-digit code sent to{" "}
                  <Text style={{ color: Nuru.navy, fontWeight: "600" }}>{email}</Text>
                </Text>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="000000"
                  placeholderTextColor={Nuru.inkLight}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                  onSubmitEditing={handleVerifyCode}
                  style={[styles.input, styles.inputCode]}
                />
              </>
            )}
          </View>

          {/* CTA */}
          <Pressable
            disabled={loading || (step === "email" ? !email.trim() : !code.trim())}
            onPress={handleSignIn}
            style={({ pressed }) => [
              styles.btn,
              {
                opacity: loading || (step === "email" ? !email.trim() : !code.trim()) ? 0.5 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>
                {step === "email" ? "Send Code" : "Sign In"}
              </Text>
            )}
          </Pressable>

          {step === "code" && (
            <Pressable onPress={() => { setStep("email"); setCode(""); }} style={{ marginTop: 16 }}>
              <Text style={styles.backLink}>← Use a different email</Text>
            </Pressable>
          )}

          {/* Footnote */}
          <Text style={styles.footnote}>
            * Built with communities · Measured by outcomes
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Nuru.navy,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Nuru.navyMid,
    borderWidth: 1,
    borderColor: Nuru.sky + "55",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: Nuru.sky,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  logoBadgeText: {
    fontSize: 26,
    color: Nuru.sky,
  },
  logoTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 44,
    fontStyle: "italic",
    fontWeight: "300",
    color: "#fff",
    letterSpacing: -1,
    lineHeight: 48,
  },
  logoSub: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.35)",
    marginTop: 6,
  },
  headline: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: 36,
    fontWeight: "300",
  },
  inputWrap: {
    width: "100%",
    marginBottom: 12,
  },
  input: {
    width: "100%",
    backgroundColor: Nuru.navyMid,
    borderWidth: 1,
    borderColor: Nuru.sky + "44",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 15,
    color: "#fff",
  },
  inputCode: {
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 8,
  },
  codeHint: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "300",
  },
  btn: {
    width: "100%",
    backgroundColor: Nuru.sky,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
    shadowColor: Nuru.sky,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  backLink: {
    fontSize: 13,
    color: Nuru.skyLight,
    fontWeight: "500",
  },
  footnote: {
    position: "absolute",
    bottom: 32,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 10,
    letterSpacing: 1.5,
    color: "rgba(255,255,255,0.2)",
    textTransform: "uppercase",
    textAlign: "center",
  },
});
