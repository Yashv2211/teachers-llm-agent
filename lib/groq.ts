import { getBCP47Code } from "./languages";

// All Groq calls go through /api/groq and /api/groq-audio.
// In dev (expo start): Metro middleware in metro.config.js handles these routes.
// In production (Vercel): serverless functions in api/ handle them.
// Direct browser-to-Groq is impossible — Groq returns 403 on all CORS preflights.

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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

// ─── Rate-limit helpers ───────────────────────────────────────────────────────

function isRateLimited(err: any): boolean {
  // Groq SDK wraps HTTP errors; status lives in different places across versions
  return (
    err?.status === 429 ||
    err?.statusCode === 429 ||
    err?.response?.status === 429 ||
    String(err?.message ?? "").includes("429") ||
    String(err?.message ?? "").toLowerCase().includes("rate limit")
  );
}

export class GroqRateLimitError extends Error {
  constructor(context: "llm" | "whisper") {
    super(
      context === "llm"
        ? "Our AI is busy right now — tap to try again in a moment."
        : "Couldn't process audio — tap to try again."
    );
    this.name = "GroqRateLimitError";
  }
}

// ─── Internal proxy helper ────────────────────────────────────────────────────

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "";

async function groqChat(payload: {
  messages: { role: string; content: string }[];
  model: string;
  max_tokens: number;
  temperature: number;
}): Promise<string> {
  const res = await fetch(`${API_BASE}/api/groq`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    if (res.status === 429) throw new GroqRateLimitError("llm");
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.error ?? `Groq error ${res.status}`);
  }
  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message?.content ?? "";
}

// ─── LLM ──────────────────────────────────────────────────────────────────────

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

  try {
    return (
      (await groqChat({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: fullSystem },
          ...history.map((m) => ({ role: m.role, content: m.text })),
        ],
        max_tokens: 512,
        temperature: 0.75,
      })) || "I'm sorry, I couldn't generate a response. Please try again."
    );
  } catch (err: any) {
    if (isRateLimited(err)) throw new GroqRateLimitError("llm");
    throw err;
  }
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

  return (
    (await groqChat({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: fullSystem }],
      max_tokens: 80,
      temperature: 0.8,
    })) || `Hi! I'm your ${subject} assistant. Let's get started!`
  );
}

// ─── STT ──────────────────────────────────────────────────────────────────────

export async function transcribeAudio(audioBlob: Blob, languageLabel?: string): Promise<string> {
  const langCode = languageLabel ? getBCP47Code(languageLabel) : "en";

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });

  try {
    const res = await fetch(`${API_BASE}/api/groq-audio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audio: base64,
        ...(langCode !== "en" ? { language: langCode } : {}),
      }),
    });
    if (!res.ok) {
      if (res.status === 429) throw new GroqRateLimitError("whisper");
      throw new Error(`Whisper error ${res.status}`);
    }
    const { text } = (await res.json()) as { text: string };
    return text ?? "";
  } catch (err: any) {
    if (isRateLimited(err)) throw new GroqRateLimitError("whisper");
    throw err;
  }
}

// ─── Question Summary ──────────────────────────────────────────────────────────

export async function summarizeQuestions(
  questions: string[],
  subject: string,
  agentName: string
): Promise<string> {
  const list = questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
  return (
    (await groqChat({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an educational analyst helping a teacher understand their students. Analyze the student questions below from a "${agentName}" ${subject} agent and write a 2–3 sentence summary covering: what topics students are most curious about, what they seem to be struggling with, and any notable patterns. Be specific and concise. Plain prose only — no bullet points or lists.`,
        },
        { role: "user", content: list },
      ],
      max_tokens: 200,
      temperature: 0.5,
    })) || "Could not generate summary."
  );
}
