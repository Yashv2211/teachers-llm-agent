// Nuru brand palette (editorial navy/sky — used by landing + login)
export const Nuru = {
  navy: '#0b1e36',
  navyDeep: '#061427',
  navyMid: '#152d4e',
  sky: '#7ba7c9',
  skyLight: '#b8d4e8',
  paper: '#f4f1ec',
  paperWarm: '#ede9e2',
  beam: '#f0e8d4',
  ink: '#1a1814',
  inkMid: '#4a4540',
  inkLight: '#8a8480',
};

// Nuru brand palette (amber/dark — used by teacher dashboard, VoiceOrb, Tailwind)
export const NuruColors = {
  background: "#0B1929",
  surface: "#152339",
  elevated: "#1E3050",
  primary: "#F59E0B",
  primaryHover: "#FBBF24",
  onPrimary: "#0B1929",
  text: "#E8DDD0",
  muted: "#C8BEAF",
  secondary: "#7A8FA8",
  border: "#243652",
  success: "#34D399",
  error: "#F87171",
  warning: "#FBBF24",
  info: "#60A5FA",
  orbFrom: "#F59E0B",
  orbTo: "#06B6D4",

  backgroundLight: "#F7F3EE",
  surfaceLight: "#FFFFFF",
  elevatedLight: "#F0EBE2",
  textLight: "#0B1929",
  mutedLight: "#1E3050",
  secondaryLight: "#6B7FA8",
  borderLight: "#E2D9CE",
};

export const Colors = {
  light: {
    text: NuruColors.textLight,
    background: NuruColors.backgroundLight,
    tint: NuruColors.primary,
    icon: NuruColors.secondaryLight,
    tabIconDefault: NuruColors.secondaryLight,
    tabIconSelected: NuruColors.primary,
  },
  dark: {
    text: NuruColors.text,
    background: NuruColors.background,
    tint: NuruColors.primary,
    icon: NuruColors.secondary,
    tabIconDefault: NuruColors.secondary,
    tabIconSelected: NuruColors.primary,
  },
};
