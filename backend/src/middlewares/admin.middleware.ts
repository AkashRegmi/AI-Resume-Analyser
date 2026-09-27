import { NextFunction, Request, Response } from "express";
import { UserRole } from "../enum/user.enum";
import { AppError } from "../utils/appError";

export const adminMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== UserRole.ADMIN) {
    return next(new AppError("Administrator access required.", 403));
  }

  next();
};
