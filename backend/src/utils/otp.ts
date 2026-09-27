import crypto from "crypto";
import { env } from "../config/env";
export const generateOTP = (length: number): string => {
  const min = 10 ** (length - 1);
  const max = 10 ** length;

  return crypto.randomInt(min, max).toString();
};
export const hashOTP = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
export const getOTPExpiry = (): Date => {
  return new Date(Date.now() + Number(env.otp_expiry) * 60 * 1000);
};
