import { Types } from "mongoose";

export interface IInterviewQuestion {
  question: string;
  category:
    | "technical"
    | "behavioral"
    | "resume"
    | "job-specific";
}

export interface IAnalysis {
  user: Types.ObjectId;

  resume: {
    originalName: string;
    extractedText: string;
  };

  jobDescription: string;

  matchScore: number;

  skills: {
    matched: string[];
    missing: string[];
    partial: string[];
  };

  strengths: string[];

  improvements: string[];

  interviewQuestions: IInterviewQuestion[];
}
export interface AnalyzeResumeServiceParams {
  userId: string;
  file: Express.Multer.File;
  jobDescription: string;
}