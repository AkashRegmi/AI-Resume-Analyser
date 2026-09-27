import { z } from "zod";

export const interviewQuestionSchema = z.object({
  question: z.string().min(1),

  category: z.enum([
    "technical",
    "behavioral",
    "resume",
    "job-specific",
  ]),
});

export const aiAnalysisSchema = z.object({
  matchScore: z.number().min(0).max(100),

  skills: z.object({
    matched: z.array(z.string()),
    missing: z.array(z.string()),
    partial: z.array(z.string()),
  }),

  strengths: z.array(z.string()),

  improvements: z.array(z.string()),

  interviewQuestions: z.array(
    interviewQuestionSchema,
  ),
});

export type AIAnalysisResult = z.infer<
  typeof aiAnalysisSchema
>;
export const aiResponseSchema = {
  type: "object",

  properties: {
    matchScore: {
      type: "number",
      description: "Resume and job description match score from 0 to 100.",
    },

    skills: {
      type: "object",

      properties: {
        matched: {
          type: "array",
          items: {
            type: "string",
          },
        },

        missing: {
          type: "array",
          items: {
            type: "string",
          },
        },

        partial: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },

      required: ["matched", "missing", "partial"],
    },

    strengths: {
      type: "array",
      items: {
        type: "string",
      },
    },

    improvements: {
      type: "array",
      items: {
        type: "string",
      },
    },

    interviewQuestions: {
      type: "array",

      items: {
        type: "object",

        properties: {
          question: {
            type: "string",
          },

          category: {
            type: "string",

            enum: [
              "technical",
              "behavioral",
              "resume",
              "job-specific",
            ],
          },
        },

        required: ["question", "category"],
      },
    },
  },

  required: [
    "matchScore",
    "skills",
    "strengths",
    "improvements",
    "interviewQuestions",
  ],
};