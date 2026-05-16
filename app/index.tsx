import { db } from "@/lib/db";
import { Nuru } from "@/constants/Colors";
import { router, Redirect } from "expo-router";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SW } = Dimensions.get("window");

const STATS = [
  { num: "250M+", label: "Children out of school globally" },
  { num: "70%", label: "Cannot read by age 10 in low-income countries" },
  { num: "$180", label: "Full programme cost per child, per year" },
];

const PILLARS = [
  { n: "01", title: "Reach the Unreached", body: "We work in communities where formal school systems have failed — conflict-affected areas, remote rural regions, and urban informal settlements." },
  { n: "02", title: "Build From Within", body: "Every programme is co-designed with the community it serves. Local educators, parents, and youth leaders shape the work." },
  { n: "03", title: "Measure What Matters", body: "We track learning outcomes, not just attendance. Rigorous, transparent impact measurement built into every partnership." },
];

function AnimatedStat({ num, label, delay }: { num: string; label: string; delay: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 700, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 700, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.statCell, { opacity, transform: [{ translateY }] }]}>
      <Text style={styles.statNum}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

function LandingScreen() {
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, { toValue: 1, duration: 900, delay: 200, useNativeDriver: true }),
      Animated.timing(heroY, { toValue: 0, duration: 900, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Nuru.navy }}>
      <StatusBar barStyle="light-content" backgroundColor={Nuru.navy} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO ── */}
        <View style={styles.hero}>
          {/* Nav */}
          <SafeAreaView edges={["top"]}>
            <View style={styles.navRow}>
              <View>
                <Text style={styles.navBrand}>Nuru.</Text>
                <Text style={styles.navSub}>The Ray of Hope</Text>
              </View>
              <Pressable
                onPress={() => router.push("/(auth)/login")}
                style={({ pressed }) => [styles.navCta, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={styles.navCtaText}>Sign In</Text>
              </Pressable>
            </View>
          </SafeAreaView>

          {/* Hero content */}
          <Animated.View style={[styles.heroContent, { opacity: heroOpacity, transform: [{ translateY: heroY }] }]}>
            <View style={styles.heroPill}>
              <View style={styles.heroDot} />
              <Text style={styles.heroPillText}>AI Voice Agents for Education</Text>
            </View>

            <Text style={styles.heroEyebrow}>Nuru — Swahili: Light</Text>
            <Text style={styles.heroTitle}>Nuru.</Text>
            <Text style={styles.heroSubtitle}>
              The <Text style={{ color: Nuru.beam, fontStyle: "italic" }}>ray of hope</Text> for every classroom the world has forgotten.
            </Text>

            <View style={styles.heroFootnotes}>
              <Text style={styles.footRow}><Text style={styles.star}>*</Text>  An education access initiative</Text>
              <Text style={styles.footRow}><Text style={styles.star}>*</Text>  Built with communities · Measured by outcomes</Text>
              <Text style={styles.footRow}><Text style={styles.star}>*</Text>  Supporting UN SDG 4 · Quality Education for all</Text>
            </View>

            <Pressable
              onPress={() => router.push("/(auth)/login")}
              style={({ pressed }) => [styles.ctaBtn, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
            >
              <Text style={styles.ctaBtnText}>Get Started  →</Text>
            </Pressable>
          </Animated.View>
        </View>

        {/* ── THE CHALLENGE ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTag}>* The Challenge</Text>
          <Text style={styles.sectionH2}>
            Education is still a{" "}
            <Text style={{ color: Nuru.sky, fontStyle: "italic" }}>privilege</Text>
            {", not a right."}
          </Text>
          <Text style={styles.sectionBody}>
            A quarter of a billion children remain locked out of school today. Not because they lack ability — because they lack access.
          </Text>

          <View style={styles.statsRow}>
            {STATS.map((s, i) => (
              <AnimatedStat key={s.num} num={s.num} label={s.label} delay={300 + i * 150} />
            ))}
          </View>
        </View>

        {/* ── MISSION ── */}
        <View style={[styles.section, { backgroundColor: Nuru.navyMid }]}>
          <Text style={[styles.sectionTag, { color: Nuru.skyLight }]}>* Our Mission</Text>
          <Text style={[styles.sectionH2, { color: "#fff" }]}>
            We believe every child deserves a{" "}
            <Text style={{ color: Nuru.skyLight, fontStyle: "italic" }}>ray of hope.</Text>
          </Text>
          <Text style={[styles.sectionBody, { color: "rgba(255,255,255,0.55)" }]}>
            Nuru exists to make quality education accessible to every child, regardless of geography, gender, or circumstance.
          </Text>

          <View style={{ marginTop: 32, gap: 0 }}>
            {PILLARS.map((p) => (
              <View key={p.n} style={styles.pillar}>
                <Text style={styles.pillarNum}>* {p.n}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pillarTitle}>{p.title}</Text>
                  <Text style={styles.pillarBody}>{p.body}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── IMPACT ── */}
        <View style={[styles.section, { backgroundColor: Nuru.paper }]}>
          <Text style={[styles.sectionTag, { color: Nuru.inkLight }]}>* Results to Date</Text>
          <Text style={[styles.sectionH2, { color: Nuru.navy }]}>
            Proven <Text style={{ color: Nuru.sky, fontStyle: "italic" }}>impact</Text> at scale.
          </Text>

          <View style={styles.impactGrid}>
            {[
              { n: "42,000+", l: "Children Directly Reached" },
              { n: "83%", l: "Literacy Improvement" },
              { n: "1,200", l: "Educators Trained" },
              { n: "6", l: "Countries" },
            ].map((item) => (
              <View key={item.n} style={styles.impactCell}>
                <Text style={[styles.impactNum, { color: Nuru.navy }]}>{item.n}</Text>
                <Text style={[styles.impactLabel, { color: Nuru.inkMid }]}>{item.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── CTA FOOTER ── */}
        <View style={[styles.section, { backgroundColor: Nuru.navy, alignItems: "center" }]}>
          <Text style={[styles.sectionTag, { color: Nuru.skyLight }]}>* Begin the Conversation</Text>
          <Text style={[styles.sectionH2, { color: "#fff", textAlign: "center" }]}>
            Let us show you what your support{" "}
            <Text style={{ color: Nuru.skyLight, fontStyle: "italic" }}>makes possible.</Text>
          </Text>
          <Text style={[styles.sectionBody, { color: "rgba(255,255,255,0.5)", textAlign: "center" }]}>
            AI voice agents, grounded in your course materials, delivered to every student.
          </Text>

          <Pressable
            onPress={() => router.push("/(auth)/login")}
            style={({ pressed }) => [
              styles.ctaBtn,
              { marginTop: 32, backgroundColor: "#fff", opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
          >
            <Text style={[styles.ctaBtnText, { color: Nuru.navy }]}>Sign In to Your Dashboard  →</Text>
          </Pressable>

          <Text style={styles.footerBar}>© Nuru Initiative 2025  ·  The Ray of Hope</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default function Index() {
  const { isLoading, user } = db.useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Nuru.navy }}>
        <ActivityIndicator size="large" color={Nuru.sky} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(teacher)" />;
  }

  return <LandingScreen />;
}

const styles = StyleSheet.create({
  // Nav
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  navBrand: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 26,
    fontStyle: "italic",
    color: "#fff",
    fontWeight: "400",
  },
  navSub: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.45)",
    marginTop: 2,
  },
  navCta: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 40,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  navCtaText: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#fff",
    fontWeight: "500",
  },

  // Hero
  hero: {
    backgroundColor: Nuru.navy,
    minHeight: 600,
    paddingBottom: 60,
  },
  heroContent: {
    paddingHorizontal: 28,
    paddingTop: 40,
  },
  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 40,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 32,
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Nuru.beam,
  },
  heroPillText: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.8)",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  heroEyebrow: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.5)",
    marginBottom: 12,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  heroTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: Math.min(SW * 0.22, 120),
    fontStyle: "italic",
    fontWeight: "300",
    color: "#fff",
    lineHeight: Math.min(SW * 0.22, 120) * 0.92,
    letterSpacing: -2,
    marginBottom: 20,
  },
  heroSubtitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22,
    color: "rgba(255,255,255,0.88)",
    lineHeight: 32,
    fontWeight: "300",
    marginBottom: 28,
    maxWidth: 340,
  },
  heroFootnotes: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
    paddingTop: 18,
    gap: 6,
    marginBottom: 36,
  },
  footRow: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 10,
    letterSpacing: 1,
    color: "rgba(255,255,255,0.55)",
    lineHeight: 18,
  },
  star: {
    color: Nuru.beam,
  },
  ctaBtn: {
    backgroundColor: Nuru.sky,
    borderRadius: 60,
    paddingHorizontal: 28,
    paddingVertical: 16,
    alignSelf: "flex-start",
    shadowColor: Nuru.sky,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  ctaBtnText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "#fff",
  },

  // Sections
  section: {
    backgroundColor: Nuru.navyDeep,
    padding: 40,
    paddingTop: 56,
    paddingBottom: 56,
  },
  sectionTag: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
    marginBottom: 20,
  },
  sectionH2: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: Math.min(SW * 0.095, 42),
    fontWeight: "300",
    lineHeight: Math.min(SW * 0.095, 42) * 1.15,
    color: Nuru.paper,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  sectionBody: {
    fontSize: 15,
    lineHeight: 24,
    color: "rgba(255,255,255,0.55)",
    fontWeight: "300",
    maxWidth: 500,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 36,
    gap: 1,
    borderTopWidth: 1,
    borderTopColor: "rgba(11,30,54,0.12)",
  },
  statCell: {
    flex: 1,
    minWidth: SW / 2 - 42,
    padding: 24,
    gap: 8,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(11,30,54,0.1)",
  },
  statNum: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: Math.min(SW * 0.1, 52),
    fontWeight: "300",
    color: Nuru.navy,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 18,
    color: Nuru.inkMid,
    fontWeight: "300",
  },

  // Pillars
  pillar: {
    flexDirection: "row",
    gap: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
    alignItems: "flex-start",
  },
  pillarNum: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 11,
    color: Nuru.skyLight,
    opacity: 0.7,
    marginTop: 4,
    minWidth: 36,
  },
  pillarTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22,
    fontWeight: "400",
    color: "#fff",
    marginBottom: 8,
  },
  pillarBody: {
    fontSize: 13,
    lineHeight: 20,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "300",
  },

  // Impact
  impactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 32,
    gap: 1,
    borderTopWidth: 1,
    borderTopColor: "rgba(11,30,54,0.12)",
  },
  impactCell: {
    minWidth: SW / 2 - 42,
    flex: 1,
    padding: 24,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(11,30,54,0.1)",
    gap: 8,
  },
  impactNum: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: Math.min(SW * 0.1, 54),
    fontWeight: "300",
    letterSpacing: -1,
  },
  impactLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
    fontWeight: "500",
    textTransform: "uppercase",
  },

  footerBar: {
    marginTop: 48,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.2)",
    textAlign: "center",
  },
});
