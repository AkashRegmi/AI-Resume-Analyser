import { z } from "zod";

export const analyzeResumeSchema = z.object({
  jobDescription: z
    .string()
    .trim()
    .min(20, "Job description must be at least 20 characters.")
    .max(10000, "Job description must not exceed 10000 characters."),
});

export type AnalyzeResumeInput = z.infer<
  typeof analyzeResumeSchema
>;