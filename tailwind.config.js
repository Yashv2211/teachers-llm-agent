/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "media", // device prefers-color-scheme on web; Appearance API on native
  theme: {
    extend: {},
  },
  plugins: [],
};
