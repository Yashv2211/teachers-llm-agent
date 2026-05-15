/**
 * Text-to-Speech — Google Cloud TTS (primary) + Web Speech (fallback)
 *
 * Students access the app via web browser, so HTMLAudioElement is available.
 * Google TTS covers all supported languages except Hausa, Amharic, and Yoruba
 * which fall back to the Web Speech API.
 */

import { getBCP47Code } from "./languages";

const GOOGLE_TTS_KEY = process.env.EXPO_PUBLIC_GOOGLE_TTS_KEY ?? "";
const GOOGLE_TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_KEY}`;

// ─── Voice Map ────────────────────────────────────────────────────────────────
// Maps language label → { languageCode, name } for Google Cloud TTS.
// Neural2 > Wavenet > Standard in quality. Use best available per language.
// Languages NOT listed here fall back to Web Speech API.

interface GoogleVoice {
  languageCode: string;
  name: string;
  /** Omit for Chirp3-HD voices — they don't accept ssmlGender */
  gender?: "MALE" | "FEMALE";
}

const GOOGLE_VOICE_MAP: Record<string, GoogleVoice> = {
  English:    { languageCode: "en-US",  name: "en-US-Neural2-D",       gender: "MALE" },
  Spanish:    { languageCode: "es-ES",  name: "es-ES-Neural2-B",       gender: "MALE" },
  French:     { languageCode: "fr-FR",  name: "fr-FR-Neural2-B",       gender: "MALE" },
  Portuguese: { languageCode: "pt-BR",  name: "pt-BR-Neural2-B",       gender: "MALE" },
  Hindi:      { languageCode: "hi-IN",  name: "hi-IN-Neural2-C",       gender: "MALE" },
  Bengali:    { languageCode: "bn-IN",  name: "bn-IN-Wavenet-B",       gender: "MALE" },
  Arabic:     { languageCode: "ar-XA",  name: "ar-XA-Wavenet-B",       gender: "MALE" },
  // Swahili has no Standard/Wavenet/Neural2 voices — Chirp3-HD only.
  // Chirp3-HD voices must NOT include ssmlGender in the request.
  Swahili:    { languageCode: "sw-KE",  name: "sw-KE-Chirp3-HD-Aoede" },
  Tagalog:    { languageCode: "fil-PH", name: "fil-PH-Wavenet-B",      gender: "MALE" },
  // Hausa, Amharic, Yoruba → not supported by Google TTS → Web Speech fallback
};

// Languages with genuine browser Web Speech support.
// Do NOT attempt Web Speech for other languages (e.g. Swahili) — browsers will
// mispronounce or read character-by-character rather than failing gracefully.
const WEB_SPEECH_LANGUAGES = new Set(["Hausa", "Amharic", "Yoruba"]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cleanForTTS(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/#{1,6}\s*/g, "")
    .replace(/[_~]/g, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function splitIntoSentences(text: string): string[] {
  const parts = text.split(/(?<=[.!?])\s+(?=[A-Z"'])/);
  const result = parts.map((s) => s.trim()).filter((s) => s.length > 2);
  return result.length > 0 ? result : [text];
}

// ─── Google TTS ───────────────────────────────────────────────────────────────

async function fetchGoogleAudio(
  text: string,
  voice: GoogleVoice
): Promise<HTMLAudioElement> {
  const res = await fetch(GOOGLE_TTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text },
      voice: {
        languageCode: voice.languageCode,
        name: voice.name,
        // Chirp3-HD voices reject ssmlGender — only include when defined
        ...(voice.gender ? { ssmlGender: voice.gender } : {}),
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 1.05,
        pitch: 0,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[TTS] API ${res.status} for voice ${voice.name}:`, err);
    throw new Error(`Google TTS error ${res.status}: ${err}`);
  }

  const { audioContent } = (await res.json()) as { audioContent: string };

  // Decode base64 → Blob → ObjectURL → Audio element
  const binary = atob(audioContent);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);
  return new Audio(url);
}

async function streamGoogleTTS(
  text: string,
  voice: GoogleVoice,
  isCancelled: () => boolean,
  onCurrentAudio: (a: HTMLAudioElement | null) => void,
  onUrl: (url: string) => void,
  registerResolver: (resolver: (() => void) | null) => void
): Promise<void> {
  const sentences = splitIntoSentences(text);
  let nextFetch = fetchGoogleAudio(sentences[0], voice);

  for (let i = 0; i < sentences.length; i++) {
    if (isCancelled()) break;

    const audio = await nextFetch;
    onUrl(audio.src);

    if (isCancelled()) {
      audio.src = "";
      break;
    }

    if (i + 1 < sentences.length) {
      nextFetch = fetchGoogleAudio(sentences[i + 1], voice).catch(() => {
        // swallow — next iteration will fail or be cancelled
        return null as unknown as HTMLAudioElement;
      });
    }

    onCurrentAudio(audio);
    await new Promise<void>((resolve, reject) => {
      registerResolver(resolve);
      audio.onended = () => {
        registerResolver(null);
        resolve();
      };
      audio.onerror = () => {
        registerResolver(null);
        reject(new Error("Audio playback error"));
      };
      audio.play().catch((e) => {
        registerResolver(null);
        reject(e);
      });
    });
    if (isCancelled()) break;
  }
}

// ─── Web Speech (fallback) ────────────────────────────────────────────────────

function speakWithWebSpeech(text: string, bcp47: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve(); // silent no-op — text is visible in UI
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = bcp47;
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(new Error(`Web Speech error: ${e.error}`));
    window.speechSynthesis.cancel(); // clear queue
    window.speechSynthesis.speak(utterance);
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface TTSHandle {
  promise: Promise<void>;
  cancel: () => void;
}

/**
 * Speak `text` in `language` using Google Cloud TTS where available,
 * falling back to Web Speech for unsupported languages.
 *
 * Returns { promise, cancel } so the caller can interrupt mid-sentence.
 */
export function speak(text: string, language: string): TTSHandle {
  const cleaned = cleanForTTS(text);

  let cancelled = false;
  let currentAudio: HTMLAudioElement | null = null;
  let activeResolver: (() => void) | null = null;
  const objectURLs: string[] = [];

  const isCancelled = () => cancelled;

  const cancel = () => {
    cancelled = true;
    window.speechSynthesis?.cancel();
    if (currentAudio) {
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    // unblock any awaiting play-promise so streamGoogleTTS exits the loop
    if (activeResolver) {
      activeResolver();
      activeResolver = null;
    }
    objectURLs.forEach((u) => URL.revokeObjectURL(u));
  };

  const voice = GOOGLE_VOICE_MAP[language];

  const promise: Promise<void> = voice && GOOGLE_TTS_KEY
    ? streamGoogleTTS(
        cleaned,
        voice,
        isCancelled,
        (a) => { currentAudio = a; },
        (url) => objectURLs.push(url),
        (r) => { activeResolver = r; }
      )
        .catch((err) => {
          console.error("[TTS] Google TTS failed:", err?.message ?? err);
          // Only fall back to Web Speech for languages browsers actually support.
          if (!cancelled && WEB_SPEECH_LANGUAGES.has(language)) {
            return speakWithWebSpeech(cleaned, getBCP47Code(language)).catch(() => {});
          }
        })
        .finally(() => {
          objectURLs.forEach((u) => URL.revokeObjectURL(u));
        })
    : WEB_SPEECH_LANGUAGES.has(language)
      ? speakWithWebSpeech(cleaned, getBCP47Code(language)).catch(() => {}) as Promise<void>
      : Promise.resolve(); // language not in Google TTS map and no Web Speech support — text visible in UI

  return { promise, cancel };
}
