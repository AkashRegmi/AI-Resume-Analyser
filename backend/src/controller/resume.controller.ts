import { NextFunction, Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { AppError } from "../utils/appError";
import { analyzeResumeService } from "../services/resume.service";

export const analyzeResume = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.userId;
    if (!req.file) {
      throw new AppError("File is Required ", 401);
    }
    const result = await analyzeResumeService({
      userId: userId.toString(),
      file: req.file,
      jobDescription: req.body.jobDescription,
    });
    return sendSuccess(res, 200, "Resume analysed Successfully", result);
  } catch (error) {
    next(error);
  }
};
