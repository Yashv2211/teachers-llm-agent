// DOCX text extraction using mammoth (web only)
export async function extractTextFromDOCX(file: File): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("DOCX extraction is only supported in the browser.");
  }

  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
