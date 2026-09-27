import { AnalyzeResumeServiceParams } from "../interface/analysis.interface";
import { Analysis } from "../models/analysis.model";
import fs from "fs/promises";
import { parseResume } from "./resume-parser.service";
import { analyzeResumeWithAI } from "./ai.service";
export const analyzeResumeService = async ({
  userId,
  file,
  jobDescription,
}: AnalyzeResumeServiceParams) => {
  try {
    const extractedText = await parseResume(file.path);
    const aiResult = await analyzeResumeWithAI({
      resumeText: extractedText,
      jobDescription,
    });

    const analysis = await Analysis.create({
      user: userId,

      resume: {
        originalName: file.originalname,
        extractedText,
      },

      jobDescription,

      matchScore: aiResult.matchScore,

      skills: aiResult.skills,

      strengths: aiResult.strengths,

      improvements: aiResult.improvements,

      interviewQuestions: aiResult.interviewQuestions,
    });

    return {
      _id: analysis._id,
      resume: {
        originalName: analysis.resume.originalName,
      },
      jobDescription: analysis.jobDescription,
      matchScore: analysis.matchScore,
      skills: analysis.skills,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      interviewQuestions: analysis.interviewQuestions,
    };
  } finally {
    try {
      await fs.unlink(file.path);
    } catch (error) {
      console.error("Failed to delete uploaded resume:", error);
    }
  }
};
