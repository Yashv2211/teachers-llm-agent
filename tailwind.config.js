/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "media", // device prefers-color-scheme on web; Appearance API on native
  theme: {
    extend: {
      colors: {
        nuru: {
          bg: "#0B1929",
          surface: "#152339",
          elevated: "#1E3050",
          primary: "#F59E0B",
          "on-primary": "#0B1929",
          text: "#E8DDD0",
          muted: "#C8BEAF",
          secondary: "#7A8FA8",
          border: "#243652",
          success: "#34D399",
          error: "#F87171",
          info: "#60A5FA",
          "bg-light": "#F7F3EE",
          "surface-light": "#FFFFFF",
          "elevated-light": "#F0EBE2",
          "text-light": "#0B1929",
          "muted-light": "#1E3050",
          "secondary-light": "#6B7FA8",
          "border-light": "#E2D9CE",
        },
      },
    },
  },
  plugins: [],
};
