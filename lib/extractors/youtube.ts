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

export async function extractYouTubeTranscript(url: string): Promise<string> {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    throw new Error("Could not find a YouTube video ID in that URL.");
  }

  // youtube-transcript works in Node/browser environments
  const { YoutubeTranscript } = await import("youtube-transcript");
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);

  return transcript.map((item) => item.text).join(" ");
}
