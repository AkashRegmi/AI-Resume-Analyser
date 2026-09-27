import fs from "fs/promises";
import path from "path";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
export const parseResume = async (filePath: string): Promise<string> => {
  const extension = path.extname(filePath).toLowerCase();

  const fileBuffer = await fs.readFile(filePath);
  const uint8Array = new Uint8Array(fileBuffer);
  switch (extension) {
    case ".pdf":
      return parsePdf(uint8Array);

    case ".docx":
      return parseDocx(uint8Array);

    default:
      throw new Error(
        "Unsupported resume format. Only PDF and DOCX are supported.",
      );
  }
};
const cleanResumeText = (text: string): string => {
  const cleanedText = text.replace(/\s+/g, " ").trim();

  if (cleanedText.length < 50) {
    throw new Error("The resume does not contain enough readable text.");
  }

  return cleanedText;
};
const parsePdf = async (fileBuffer: Uint8Array): Promise<string> => {
  const data = await new PDFParse(fileBuffer);

  const text = (await data.getText()).text;

  if (!text) {
    throw new Error("Could not extract text from the PDF resume.");
  }

  return cleanResumeText(text);
};
const parseDocx = async (fileBuffer: Uint8Array): Promise<string> => {
  const result = await mammoth.extractRawText({
    buffer: Buffer.from(fileBuffer),
  });

  const text = result.value.trim();

  if (!text) {
    throw new Error("Could not extract text from the DOCX resume.");
  }

  return cleanResumeText(text);
};
