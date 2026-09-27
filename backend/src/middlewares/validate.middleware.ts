import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { ZodSchema } from "zod/v3";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          statue: 400,
          success: false,
          message: result.error.issues[0]?.message || "Invalid input",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
