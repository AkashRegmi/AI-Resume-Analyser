import jwt, { JsonWebTokenError, JwtPayload, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface TokenPayload {
  userId: string;
  role: number;
  email: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.jwt.accessSecret as string, {
    expiresIn: env.jwt.accessExpiresIn as NonNullable<SignOptions["expiresIn"]>,
  });
};
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.jwt.refreshSecret as string, {
    expiresIn: env.jwt.refreshExpiresIn as NonNullable<
      SignOptions["expiresIn"]
    >,
  });
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const payload = jwt.verify(token, env.jwt.refreshSecret as string, {
    algorithms: ["HS256"],
  });

  if (
    typeof payload === "string" ||
    typeof payload.userId !== "string" ||
    typeof payload.role !== "number" ||
    typeof payload.email !== "string"
  ) {
    throw new JsonWebTokenError("Invalid refresh token payload");
  }

  return {
    userId: payload.userId,
    role: payload.role,
    email: payload.email,
  };
};
