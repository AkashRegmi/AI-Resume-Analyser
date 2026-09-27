import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { ZodError } from "zod";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { MulterError } from "multer";
import { cleanupUploadedFiles } from "./multer.middleware";
import { FileUploadError } from "../utils/fileUploadError";
import OpenAI from "openai";

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log(error);
  //   cleanupUploadedFiles(req);
  if (error instanceof AppError) {
    if (error.status === 503) {
      return res.status(503).json({
        success: false,
        status: 503,
        message: "AI service is currently busy. Please try again later.",
      });
    }
    return res.status(error.status).json({
      success: error.success,
      status: error.status,
      message: error.message,
    });
  }
  if (error instanceof FileUploadError) {
    // Only true if it was created with `new FileUploadError(...)`
    // NOT true for MulterError, ZodError, or a plain Error
    return res.status(400).json({
      success: false,
      status: 400,
      message: error.message, // "This field accepts only: pdf"
    });
  }
  if (error instanceof OpenAI.APIError) {
    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        status: 429,
        message: "AI service rate limit reached. Please try again later.",
      });
    }
    return res.status(400).json({
      success: false,
      status: 429,
      message:
        "AI analysis is temporarily unavailable because the API credit balance has been exhausted.",
    });
  }
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }
  if (error instanceof MulterError) {
    let message = error.message;

    if (error.code === "LIMIT_FILE_SIZE") {
      message = `File is too large${error.field ? ` in field "${error.field}"` : ""}`;
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      message = `Unexpected file in field "${error.field}"`;
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      message = `Too many files uploaded${error.field ? ` in field "${error.field}"` : ""}`;
    }

    return res.status(400).json({
      success: false,
      status: 400,
      message,
    });
  }
  if (error instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: "Token expired, please log in again",
    });
  }
  if (error instanceof JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: "Invalid token",
    });
  }
  return res.status(500).json({
    success: false,
    status: 500,
    message: "OOPS! Something went wrong",
  });
};
