import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError("Authentication required.", 401);
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError("Tokem is not found", 401);
    }
    const decoded = (await jwt.verify(
      token as string,
      env.jwt.accessSecret as string,
    )) as JwtPayload;
    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};
