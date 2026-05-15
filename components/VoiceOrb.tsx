/**
 * VoiceOrb — animated iridescent sphere for voice states.
 *
 * Low-resource design:
 *   • Pure React Native Views + transforms (GPU-accelerated)
 *   • Single rotation loop driven by Animated.Value
 *   • Animation runs only when active (state !== "idle")
 *   • Radial gradient via react-native-web style passthrough on web;
 *     layered concentric circles on native fallback
 *
 * Three states map to three palettes:
 *   listening  → red/pink
 *   thinking   → purple/violet
 *   speaking   → blue/purple/pink (matches reference image)
 */

import { useEffect, useRef } from "react";
import { Animated, Easing, Platform, View } from "react-native";

export type OrbState = "idle" | "listening" | "thinking" | "speaking";

interface PaletteEntry {
  core: string;
  midA: string;
  midB: string;
  rim: string;
}

const PALETTES: Record<OrbState, PaletteEntry> = {
  idle: {
    core: "#a5b4fc", // soft indigo
    midA: "#818cf8",
    midB: "#c7d2fe",
    rim: "#1e1b4b",
  },
  speaking: {
    core: "#a78bfa", // violet
    midA: "#60a5fa", // blue
    midB: "#f0abfc", // pink
    rim: "#1e1b4b", // deep indigo
  },
  thinking: {
    core: "#c084fc",
    midA: "#7c3aed",
    midB: "#a78bfa",
    rim: "#1e1b4b",
  },
  listening: {
    core: "#fb7185",
    midA: "#f43f5e",
    midB: "#fda4af",
    rim: "#450a0a",
  },
};

interface VoiceOrbProps {
  state: OrbState;
  size?: number;
}

export function VoiceOrb({ state, size = 140 }: VoiceOrbProps) {
  const rotate = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  // Drive animations at state-specific tempos. Idle = slow & calm.
  useEffect(() => {
    const rotateDuration =
      state === "speaking" ? 6000 : state === "idle" ? 14000 : 9000;
    const pulseDuration =
      state === "speaking" ? 900 : state === "idle" ? 2400 : 1400;

    const rotateLoop = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: rotateDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: pulseDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: pulseDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    rotateLoop.start();
    pulseLoop.start();

    return () => {
      rotateLoop.stop();
      pulseLoop.stop();
    };
  }, [state, rotate, pulse]);

  const palette = PALETTES[state];
  const isWeb = Platform.OS === "web";

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const counterSpin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });
  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });
  const innerScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1.02],
  });

  // Web: real radial gradients for glass-orb look
  const webGradients = {
    outer: {
      backgroundImage: `radial-gradient(circle at 30% 30%, ${palette.midA} 0%, ${palette.core} 30%, ${palette.midB} 55%, ${palette.rim} 100%)`,
    } as any,
    highlight: {
      backgroundImage: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.2) 18%, rgba(255,255,255,0) 45%)`,
    } as any,
    sheen: {
      backgroundImage: `radial-gradient(ellipse at 70% 80%, ${palette.midB}aa 0%, transparent 50%)`,
    } as any,
    glow: {
      boxShadow: `0 0 ${size * 0.4}px ${palette.midA}55, 0 0 ${size * 0.7}px ${palette.core}33`,
    } as any,
  };

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Outer glow halo (web only — boxShadow) */}
      {isWeb && (
        <View
          style={[
            {
              position: "absolute",
              width: size,
              height: size,
              borderRadius: size / 2,
            },
            webGradients.glow,
          ]}
        />
      )}

      {/* Rotating colour body */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ rotate: spin }, { scale }],
            backgroundColor: isWeb ? "transparent" : palette.core,
            overflow: "hidden",
          },
          isWeb ? webGradients.outer : null,
        ]}
      >
        {/* Native fallback: concentric layers fake the gradient */}
        {!isWeb && (
          <>
            <View
              style={{
                position: "absolute",
                top: size * 0.1,
                left: size * 0.1,
                width: size * 0.8,
                height: size * 0.8,
                borderRadius: (size * 0.8) / 2,
                backgroundColor: palette.midA,
                opacity: 0.85,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: size * 0.2,
                left: size * 0.2,
                width: size * 0.6,
                height: size * 0.6,
                borderRadius: (size * 0.6) / 2,
                backgroundColor: palette.midB,
                opacity: 0.75,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: size * 0.3,
                left: size * 0.3,
                width: size * 0.4,
                height: size * 0.4,
                borderRadius: (size * 0.4) / 2,
                backgroundColor: palette.core,
              }}
            />
          </>
        )}
      </Animated.View>

      {/* Counter-rotating sheen for movement */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ rotate: counterSpin }, { scale: innerScale }],
            opacity: 0.55,
          },
          isWeb ? webGradients.sheen : null,
        ]}
      />

      {/* Specular highlight (top-left glare) — static, not animated */}
      <View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          isWeb
            ? webGradients.highlight
            : {
                top: size * 0.12,
                left: size * 0.18,
                width: size * 0.25,
                height: size * 0.18,
                borderRadius: size * 0.15,
                backgroundColor: "rgba(255,255,255,0.7)",
              },
        ]}
      />
    </View>
  );
}
