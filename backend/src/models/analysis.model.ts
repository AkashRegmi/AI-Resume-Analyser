import { model, Schema } from "mongoose";
import { IAnalysis, IInterviewQuestion } from "../interface/analysis.interface";

const interviewQuestionSchema = new Schema<IInterviewQuestion>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "technical",
        "behavioral",
        "resume",
        "job-specific",
      ],
      required: true,
    },
  },
  {
    _id: false,
  },
);
const analysisSchema = new Schema<IAnalysis>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resume: {
      originalName: {
        type: String,
        required: true,
        trim: true,
      },

      extractedText: {
        type: String,
        required: true,
      },
    },

    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },

    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    skills: {
      matched: {
        type: [String],
        default: [],
      },

      missing: {
        type: [String],
        default: [],
      },

      partial: {
        type: [String],
        default: [],
      },
    },

    strengths: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    interviewQuestions: {
      type: [interviewQuestionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Analysis = model<IAnalysis>(
  "Analysis",
  analysisSchema,
);