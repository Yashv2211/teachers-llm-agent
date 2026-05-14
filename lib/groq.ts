import Groq from "groq-sdk";
import { getBCP47Code } from "./languages";

const groq = new Groq({
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

// 12-level phrasing map — pairs of grades share the same cognitive band
const GRADE_PHRASING: Record<string, string> = {
  "1": "Use very simple words and very short sentences. Be playful, warm, and extremely encouraging. Give only one small idea at a time. Use fun comparisons a young child would know — toys, animals, family. Celebrate every single answer.",
  "2": "Use very simple words and very short sentences. Be playful, warm, and extremely encouraging. Give only one small idea at a time. Use fun comparisons a young child would know — toys, animals, family. Celebrate every single answer.",
  "3": "Use simple, clear language with short paragraphs. Introduce only one new idea at a time with a relatable everyday example. Be warm and encouraging. Ask simple questions to check understanding.",
  "4": "Use simple, clear language with short paragraphs. Introduce only one new idea at a time with a relatable everyday example. Be warm and encouraging. Ask simple questions to check understanding.",
  "5": "Explain clearly. Introduce subject-specific terms and immediately define them. Use concrete real-life examples. Ask a follow-up question to check understanding after each explanation.",
  "6": "Explain clearly. Introduce subject-specific terms and immediately define them. Use concrete real-life examples. Ask a follow-up question to check understanding after each explanation.",
  "7": "Use subject vocabulary comfortably but always explain new terms in context. Encourage students to reason through problems rather than just recall facts. Connect ideas across topics.",
  "8": "Use subject vocabulary comfortably but always explain new terms in context. Encourage students to reason through problems rather than just recall facts. Connect ideas across topics.",
  "9": "Use correct subject terminology. Expect some prior knowledge and build on it. Be thorough but concise. Push students to think critically and make connections between concepts.",
  "10": "Use correct subject terminology. Expect some prior knowledge and build on it. Be thorough but concise. Push students to think critically and make connections between concepts.",
  "11": "Be rigorous and precise. Use exam-level vocabulary and depth. Challenge students with nuanced questions. Expect analytical thinking and evidence-based reasoning, not just recall.",
  "12": "Be rigorous and precise. Use exam-level vocabulary and depth. Challenge students with nuanced questions. Expect analytical thinking and evidence-based reasoning, not just recall.",
};

function buildTopicGuard(subject: string): string {
  return `Your sole purpose is to help students with ${subject}. You must stay strictly within this subject at all times. If a student asks about anything unrelated to ${subject} — other school subjects, personal topics, current events, or anything off-topic — warmly acknowledge their curiosity and immediately redirect: "That's interesting! But I'm here as your ${subject} helper, so let's stay focused. What ${subject} question can I help you with?" Never answer off-topic questions under any circumstances.`;
}

const PERSONALITY_BOOST =
  "Speak naturally and warmly, like a knowledgeable older sibling — never stiff or robotic. Use contractions (you're, let's, that's). Show genuine excitement when a student gets something right. Keep responses short and conversational — this is a voice chat, not a textbook. Never use bullet points or numbered lists. If a student seems confused, rephrase from a completely fresh angle instead of repeating yourself. End with a quick check-in or follow-up question to keep the conversation going. CRITICAL: Your response will be read aloud by a text-to-speech engine. Write ONLY in natural spoken sentences. Never use markdown symbols, asterisks, dashes, colons introducing lists, or parentheses. Write exactly as a warm human teacher would speak out loud.";

// ─── LLM ──────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export async function sendMessage(
  systemPrompt: string,
  contextText: string | null | undefined,
  history: ChatMessage[],
  gradeLevel: string,
  language: string,
  subject: string
): Promise<string> {
  const gradePhrasing = GRADE_PHRASING[gradeLevel] ?? GRADE_PHRASING["6"];
  const topicGuard = buildTopicGuard(subject);

  const fullSystem = [
    systemPrompt,
    topicGuard,
    gradePhrasing,
    PERSONALITY_BOOST,
    `Always respond in ${language}. Do not switch languages.`,
    contextText ? `\n\nCourse material to reference:\n${contextText}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: fullSystem },
      ...history.map((m) => ({ role: m.role, content: m.text })),
    ],
    max_tokens: 512,
    temperature: 0.75,
  });

  return (
    response.choices[0]?.message?.content ??
    "I'm sorry, I couldn't generate a response. Please try again."
  );
}

export async function generateGreeting(
  systemPrompt: string,
  contextText: string | null | undefined,
  gradeLevel: string,
  language: string,
  subject: string,
  agentName: string
): Promise<string> {
  const gradePhrasing = GRADE_PHRASING[gradeLevel] ?? GRADE_PHRASING["6"];

  const fullSystem = [
    systemPrompt,
    gradePhrasing,
    PERSONALITY_BOOST,
    `Always respond in ${language}. Do not switch languages.`,
    contextText ? `\n\nCourse material to reference:\n${contextText}` : "",
    `You are about to meet a student for the first time today. Generate ONE warm, enthusiastic opening message. If course material is provided, briefly mention the specific topic you'll be covering. Keep it to 1–2 short sentences. Do not ask a question yet — just greet them and hint at what's ahead.`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "system", content: fullSystem }],
    max_tokens: 80,
    temperature: 0.8,
  });

  return (
    response.choices[0]?.message?.content ??
    `Hi! I'm your ${subject} assistant. Let's get started!`
  );
}

// ─── STT ──────────────────────────────────────────────────────────────────────

export async function transcribeAudio(audioBlob: Blob, languageLabel?: string): Promise<string> {
  const langCode = languageLabel ? getBCP47Code(languageLabel) : "en";
  const file = new File([audioBlob], "audio.webm", { type: "audio/webm" });
  const transcript = await groq.audio.transcriptions.create({
    file,
    model: "whisper-large-v3-turbo",
    response_format: "text",
    ...(langCode !== "en" ? { language: langCode } : {}),
  }) as unknown as string;
  return transcript.trim();
}

// ─── TTS ──────────────────────────────────────────────────────────────────────

const PLAYAI_VOICE_MAP: Record<string, string> = {
  English: "Fritz-PlayAI",
};

export function groqVoiceForLanguage(language: string): string | null {
  return PLAYAI_VOICE_MAP[language] ?? null;
}

function cleanForTTS(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // **bold** → bold
    .replace(/\*(.*?)\*/g, "$1") // *italic* → italic
    .replace(/`([^`]*)`/g, "$1") // `code` → code
    .replace(/#{1,6}\s*/g, "") // # headers
    .replace(/[_~]/g, "") // underline / strikethrough chars
    .replace(/\n{2,}/g, ". ") // paragraph breaks → natural pause
    .replace(/\n/g, " ") // single newlines → space
    .replace(/\s{2,}/g, " ") // collapse extra spaces
    .trim();
}

function splitIntoSentences(text: string): string[] {
  // Split after sentence-ending punctuation followed by whitespace + capital/quote
  const parts = text.split(/(?<=[.!?])\s+(?=[A-Z"'])/);
  const result = parts.map((s) => s.trim()).filter((s) => s.length > 2);
  return result.length > 0 ? result : [text];
}

async function fetchSentenceAudio(
  text: string,
  voice: string
): Promise<HTMLAudioElement> {
  const response = await groq.audio.speech.create({
    model: "playai-tts",
    voice: voice as any,
    input: text,
    response_format: "mp3",
    speed: 1.05,
  });
  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  return audio;
}

export async function speakWithGroqTTS(
  text: string,
  voice: string
): Promise<{ promise: Promise<void>; cancel: () => void }> {
  const cleaned = cleanForTTS(text);
  const sentences = splitIntoSentences(cleaned);

  let cancelled = false;
  let currentAudio: HTMLAudioElement | null = null;
  const objectURLs: string[] = [];

  const promise = (async () => {
    // Prefetch first sentence immediately
    let nextAudioPromise = fetchSentenceAudio(sentences[0], voice);

    for (let i = 0; i < sentences.length; i++) {
      if (cancelled) break;

      const audio = await nextAudioPromise;
      if (cancelled) {
        audio.src = "";
        break;
      }

      // Start prefetching next sentence in parallel
      if (i + 1 < sentences.length) {
        nextAudioPromise = fetchSentenceAudio(sentences[i + 1], voice);
      }

      currentAudio = audio;
      objectURLs.push(audio.src);

      await new Promise<void>((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error("Audio error"));
        audio.play().catch(reject);
      });
    }

    // Cleanup
    objectURLs.forEach((u) => URL.revokeObjectURL(u));
  })();

  const cancel = () => {
    cancelled = true;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    objectURLs.forEach((u) => URL.revokeObjectURL(u));
  };

  return { promise, cancel };
}

export function speakWithWebSpeech(text: string, language: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.warn("speakWithWebSpeech: Web Speech API not available");
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getBCP47Code(language);
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith(utterance.lang.split("-")[0]) &&
        (v.name.includes("Google") || v.name.includes("Neural") || v.name.includes("Natural"))
    );
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(new Error(`Web Speech error: ${e.error}`));

    window.speechSynthesis.speak(utterance);
  });
}
