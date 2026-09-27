import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { UserRole } from "../enum/user.enum";
import { sendSuccessWithPagination } from "../utils/response";

const positiveInteger = (value: unknown, fallback: number): number => {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = positiveInteger(req.query.page, 1);
    const limit = Math.min(positiveInteger(req.query.limit, 20), 100);
    const skip = (page - 1) * limit;
    const filter = { role: UserRole.USER };

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("name email role isEmailVerified createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    const safeUsers = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    }));

    return sendSuccessWithPagination(
      res,
      200,
      "Users retrieved successfully.",
      page,
      limit,
      Math.ceil(total / limit),
      safeUsers,
    );
  } catch (error) {
    next(error);
  }
};
