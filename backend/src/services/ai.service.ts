import OpenAI from "openai";
import { env } from "../config/env";
import { AIAnalysisResult, aiAnalysisSchema, aiResponseSchema } from "../schema/ai.schema";
import { GoogleGenAI } from "@google/genai";
import zodToJsonSchema from "zod-to-json-schema";
import { AppError } from "../utils/appError";

const openai = new GoogleGenAI({
  apiKey: env.openai_apikey as string,
});
interface AnalyzeResumeWithAIParams {
  resumeText: string;
  jobDescription: string;
}
export const analyzeResumeWithAI = async ({
  resumeText,
  jobDescription,
}: AnalyzeResumeWithAIParams): Promise<AIAnalysisResult> => {
  const prompt = `
You are an expert AI resume analyzer.

Analyze the candidate's resume against the provided job description.

Your task is to determine:

1. Overall match score from 0 to 100.
2. Skills that are clearly present in both the resume and job description.
3. Skills required by the job description that are missing from the resume.
4. Skills that are partially matched.
5. Strengths of the resume relevant to the job.
6. Specific improvements the candidate should make.
7. Interview questions based on the resume and job description.

IMPORTANT RULES:

- Only use information provided in the resume and job description.
- Do not invent experience.
- Do not invent skills.
- Do not assume the candidate knows a technology unless the resume supports it.
- The match score must be between 0 and 100.
- Keep strengths and improvements specific.
- Generate useful interview questions.
- Return only the requested JSON structure.

RESUME:

${resumeText}

--------------------------------

JOB DESCRIPTION:

${jobDescription}
`;
  try {
    const response = await openai.models?.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",

        responseSchema: aiResponseSchema,
      },
    });

    const content = response.text;
    if (!content) {
      throw new Error("AI did not return an analysis.");
    }
    let parsedResponse: unknown;
    try {
      parsedResponse = JSON.parse(content);
    } catch (error) {
      throw new Error("AI returned an invalid JSON response.");
    }
    const validation = aiAnalysisSchema.safeParse(parsedResponse);
    if (!validation.success) {
      throw new AppError("AI returned an invalid analysis structure.",500);
    }
    return validation.data;
  } catch (error) {
    console.error("Gemini AI error:", error);

    throw error;
  }
};
