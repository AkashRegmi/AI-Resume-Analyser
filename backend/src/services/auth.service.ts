import { createHash } from "node:crypto";
import { RegisterUser, verifyOtp } from "../interface/user.interface";
import { User } from "../models/user.model";
import { AppError } from "../utils/appError";
import { sendEmail } from "../utils/email";
import { generateOTP, getOTPExpiry, hashOTP } from "../utils/otp";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.utils";

const hashRefreshToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export const registerUserService = async ({
  name,
  email,
  password,
}: RegisterUser) => {
  const normalizedEmail = email.trim().toLowerCase();
  // Check if user already exists
  const existingUser = await User.findOne({
    email: normalizedEmail,
  });
  if (existingUser) {
    // User already verified
    if (existingUser.isEmailVerified) {
      throw new AppError("User is already registered.", 409);
    }
    // User exists but email is not verified
    const otp = generateOTP(4);
    existingUser.otp = {
      hash: hashOTP(otp),
      expiresAt: getOTPExpiry(),
      attempts: 0,
    };
    await existingUser.save();
    await sendEmail(existingUser.email, "verify OTP", "otp.verify", {
      name: existingUser.email,
      otp,
      year: new Date().getFullYear(),
    });
    return;
  }

  const otp = generateOTP(4);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,

    isEmailVerified: false,

    password,
    otp: {
      hash: hashOTP(otp),
      expiresAt: getOTPExpiry(),
      attempts: 0,
    },
  });
  await sendEmail(email, "verify OTP", "otp.verify", {
    name: user.name,
    otp,
    year: new Date().getFullYear(),
  });
  return {
    userId: user._id,
  };
};
export const verifyUserOtpService = async ({ email, otp }: verifyOtp) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new AppError("User is not register.Please Signup", 404);
  }
  if (user.isEmailVerified) {
    throw new AppError("Email is already verified.", 400);
  }
  if (!user.otp?.hash || !user.otp.expiresAt) {
    throw new AppError("OTP not found. Please request a new OTP.", 400);
  }
  if (new Date() > user.otp.expiresAt) {
    throw new AppError("OTP has expired. Please request a new OTP.", 400);
  }
  const hashedOtp = hashOTP(otp);
  if (user.otp?.hash !== hashedOtp) {
    user.otp.attempts += 1;
    await user.save();
    throw new AppError("Invalid OTP.", 400);
  }
  user.isEmailVerified = true;
  user.otp = {
    hash: "",
    expiresAt: new Date(0),
    attempts: 0,
  };

  await user.save();
  return {
    userId: user._id,
    isEmailVerified: user.isEmailVerified,
  };
};
export const loginService = async ({ email, password }: any) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (!user.isEmailVerified) {
    throw new AppError("Please verify your email first.", 403);
  }
  const isCorrectPassword = await user.comparePassword(password);
  if (!isCorrectPassword) {
    throw new AppError("Invalid email or password.", 401);
  }

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  });
  user.refreshTokenHash = hashRefreshToken(refreshToken);
  await user.save();

  const userObject = user.toObject();
  const {
    password: _password,
    otp: _otp,
    refreshTokenHash: _refreshTokenHash,
    ...safeUser
  } = userObject;
  return {
    accessToken,
    refreshToken,
    user: safeUser,
  };
};

export const refreshTokenService = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);

  if (!/^[0-9a-f]{24}$/i.test(payload.userId)) {
    throw new AppError("Invalid refresh token", 401);
  }

  const user = await User.findById(payload.userId);
  if (!user || !user.isEmailVerified) {
    throw new AppError("Invalid refresh token", 401);
  }

  const tokenPayload = {
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  };
  const accessToken = generateAccessToken(tokenPayload);
  const nextRefreshToken = generateRefreshToken(tokenPayload);

  const rotation = await User.updateOne(
    {
      _id: user._id,
      refreshTokenHash: hashRefreshToken(refreshToken),
    },
    {
      $set: { refreshTokenHash: hashRefreshToken(nextRefreshToken) },
    },
  );

  if (rotation.matchedCount !== 1) {
    throw new AppError(
      "Refresh token is invalid or has already been used",
      401,
    );
  }

  return { accessToken, refreshToken: nextRefreshToken };
};
