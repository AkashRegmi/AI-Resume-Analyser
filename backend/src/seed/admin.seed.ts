import mongoose from "mongoose";
import { connectDatabase } from "../config/database";
import { env } from "../config/env";
import { UserRole } from "../enum/user.enum";
import { User } from "../models/user.model";

const seedAdmin = async () => {
  await connectDatabase();

  try {
    const email = (env.super_admin_email as string).trim().toLowerCase();
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      existingAdmin.role = UserRole.ADMIN;
      existingAdmin.isEmailVerified = true;
      await existingAdmin.save();
      console.log("Configured existing account as the administrator.");
      return;
    }

    await User.create({
      name: env.super_admin_name as string,
      email,
      password: env.super_admin_password as string,
      role: UserRole.ADMIN,
      isEmailVerified: true,
    });
    console.log("Administrator account created successfully.");
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin().catch((error) => {
  console.error("Failed to seed administrator:", error);
  process.exitCode = 1;
});
