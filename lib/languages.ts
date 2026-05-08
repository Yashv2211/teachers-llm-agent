export const SUPPORTED_LANGUAGES: { label: string; bcp47: string }[] = [
  { label: "English", bcp47: "en" },
  { label: "Swahili", bcp47: "sw" },
  { label: "Hindi", bcp47: "hi" },
  { label: "Arabic", bcp47: "ar" },
  { label: "Spanish", bcp47: "es" },
  { label: "French", bcp47: "fr" },
  { label: "Portuguese", bcp47: "pt" },
  { label: "Bengali", bcp47: "bn" },
  { label: "Hausa", bcp47: "ha" },
  { label: "Amharic", bcp47: "am" },
  { label: "Tagalog", bcp47: "tl" },
  { label: "Yoruba", bcp47: "yo" },
];

export function getBCP47Code(language: string): string {
  const entry = SUPPORTED_LANGUAGES.find((l) => l.label === language);
  if (!entry) {
    console.warn(`getBCP47Code: unknown language "${language}", falling back to "en"`);
    return "en";
  }
  return entry.bcp47;
}
