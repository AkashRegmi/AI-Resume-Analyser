import { model, Schema } from "mongoose";
import { IUser } from "../interface/user.interface";
import { UserRole } from "../enum/user.enum";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { env } from "../config/env";
import { runInNewContext } from "vm";
const OTP_EXPIRY_TIME = 5 * 60 * 1000;
const saltNumber = Number(env.salt);
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      select: false,
      required: true,
    },

    refreshTokenHash: {
      type: String,
      select: false,
    },

    role: {
      type: Number,
      enum: UserRole,
      default: UserRole.USER,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      hash: {
        type: String,
      },

      expiresAt: {
        type: Date,
      },

      attempts: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);
userSchema.pre("save", async function () {
  // Don't hash if password hasn't changed
  if (!this.isModified("password")) return;
  //Password must exist
  if (!this.password) {
    return new Error("Password is required");
  }
  this.password = await hashPassword(this.password);
});
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  if (!this.password) {
    return false;
  }

  return comparePassword(candidatePassword, this.password);
};

export const User = model<IUser>("User", userSchema);
