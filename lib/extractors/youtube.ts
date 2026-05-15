// YouTube transcript extraction
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

const YOUTUBE_URL_PATTERN =
  /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)/;

export function isYouTubeURL(url: string): boolean {
  return YOUTUBE_URL_PATTERN.test(url.trim());
}

export async function extractYouTubeTranscript(url: string): Promise<string> {
  if (!isYouTubeURL(url)) {
    throw new Error(
      "That doesn't look like a valid YouTube URL. Try a link like youtube.com/watch?v=..."
    );
  }

  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    throw new Error("Could not find a YouTube video ID in that URL.");
  }

  try {
    const { YoutubeTranscript } = await import("youtube-transcript");
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    if (!transcript.length) {
      throw new Error(
        "No transcript found for that video. The video may not have captions — try a different video or upload a PDF instead."
      );
    }
    return transcript.map((item) => item.text).join(" ");
  } catch (err: any) {
    // Re-throw our own errors as-is; wrap library errors
    if (err?.message?.includes("transcript") || err?.message?.includes("captions")) throw err;
    throw new Error(
      "No transcript found for that video. Try a different video or upload a PDF instead."
    );
  }
}
