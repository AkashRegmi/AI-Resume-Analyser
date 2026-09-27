import { Document } from "mongoose";
import { UserRole } from "../enum/user.enum";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  refreshTokenHash?: string;
  role: UserRole;
  isEmailVerified: boolean;
  profilePicture?: string;

  otp?: {
    hash: string;
    expiresAt: Date;
    attempts: number;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  generateOTP(): Promise<string>;
  verifyOTP(otp: string): Promise<boolean>;
  clearOTP(): void;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface RegisterUser {
  name: string;
  email: string;
  password: string;
}
export interface verifyOtp {
  email: string;
  otp: string;
}
export interface LoginInterface {
  email: string;
  password: string;
}
