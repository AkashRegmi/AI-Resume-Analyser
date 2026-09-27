import { NextFunction, Request, Response } from "express";
import {
  loginService,
  refreshTokenService,
  registerUserService,
  verifyUserOtpService,
} from "../services/auth.service";
import { sendSuccess } from "../utils/response";

export const registeOwner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;

    const data = await registerUserService({ name, email, password });
    return sendSuccess(
      res,
      201,
      "Registration successful. Please check your email for the OTP.",
      data,
    );
  } catch (error) {
    next(error);
  }
};
export const verifyUserOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.body;
    const data = await verifyUserOtpService({ email, otp });
    return sendSuccess(res, 200, "OTP verify Successfully", data);
  } catch (error) {
    next(error);
  }
};
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const data = await loginService({ email, password });
    return sendSuccess(res, 200, "Login SuccessFully", data);
  } catch (error) {
    throw error;
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tokens = await refreshTokenService(req.body.refreshToken);
    return sendSuccess(res, 200, "Tokens refreshed successfully", tokens);
  } catch (error) {
    next(error);
  }
};
