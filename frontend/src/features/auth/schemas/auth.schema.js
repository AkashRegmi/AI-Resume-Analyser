import * as z from "zod";

export const registerSchema = z.object({
  name: z
    .string("Please provide the full name")
    .min(2, "Full name must be at least 2 characters")
    .max(25, "Full name must not exceed 25 characters"),
  email: z
    .string("Please provide an email")
    .email("Please provide a valid email address"),
  password: z
    .string("Please provide a password")
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export const verifyOTPSchema = z.object({
  email: z
    .string("Email is required")
    .email("Please provide a valid email address"),

  otp: z
    .string("OTP is required")
    .length(4, "OTP must be 4 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
export const LoginSchema = z.object({
  email: z
    .string("Please provide an email")
    .email("Please provide a valid email address"),
  password: z.string("Please provide a password"),
});
