export { extractTextFromPDF } from "./pdf";
export { extractTextFromDOCX } from "./docx";
export { extractYouTubeTranscript, extractYouTubeVideoId } from "./youtube";
export { extractTextFromURL } from "./url";

// ~6,000 tokens ≈ 24,000 characters. Leave room for system prompt.
const MAX_CONTEXT_CHARS = 20000;

export interface ContextSource {
  type: "pdf" | "docx" | "youtube" | "url" | "library";
  label: string;
  text: string;
}

/**
 * Combines multiple extracted text sources and truncates to stay within
 * the model's context budget. Each source is labelled in the output.
 */
export function combineAndTruncate(sources: ContextSource[]): string {
  const parts = sources.map(
    (s) => `--- ${s.label} ---\n${s.text}`
  );
  const combined = parts.join("\n\n");

  if (combined.length <= MAX_CONTEXT_CHARS) {
    return combined;
  }

  // Truncate and add a note
  return (
    combined.slice(0, MAX_CONTEXT_CHARS) +
    "\n\n[Content truncated to fit context limit]"
  );
}
