import "dotenv/config";

const requiredEnv = [
  "PORT",
  "API_URL",
  "NODE_ENV",
  "SALT_ROUND",
  "MONGODB_URI",
  "JWT_ACCESS_TOKEN_SECRETE",
  "JWT_REFRESH_TOKEN_SECRETE",
  "REFRESH_JWT_EXPIRES_IN",
  "ACCESS_JWT_EXPIRES_IN",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "SMTP_PASS",
  "EMAIL_USER",
  "OTP_EXPIRY_MINUTES",
  "SUPERADMIN_EMAIL",
  "SUPERADMIN_PASSWORD",
  "SUPER_ADMIN_NAME",
  "OPEN_AI_APIKEY",
] as const;
//here Without as const, TypeScript allows you to modify the array later (e.g., requiredEnv.push("NEW_VAR")). With as const, the array becomes completely immutable. If you try to add, remove, or change elements, TypeScript will throw a compiler error.
//for thr misssing env
const missingEnv: string[] = [];
for (let key of requiredEnv) {
  if (!process.env[key]) {
    missingEnv.push(key);
  }
}
if (missingEnv?.length > 0) {
  console.error("Missing environment variables:");
  for (const key of missingEnv) {
    console.error(`   - ${key}`);
  }

  process.exit(1);
}
export const env = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  apiUrl: process.env.API_URL,
  saltRounds: Number(process.env.SALT_ROUND),

  mongodbUri: process.env.MONGODB_URI,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_TOKEN_SECRETE,
    refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRETE,

    accessExpiresIn: process.env.ACCESS_JWT_EXPIRES_IN,
    refreshExpiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
  },

  email: {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    user: process.env.EMAIL_USER,
    password: process.env.SMTP_PASS,
  },
  salt: process.env.SALT_ROUND,
  otp_expiry: process.env.OTP_EXPIRY_MINUTES,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloud_api_key: process.env.CLOUDINARY_API_KEY,
  cloud_api_secrete: process.env.CLOUDINARY_API_SECRET,
  super_admin_email: process.env.SUPERADMIN_EMAIL,
  super_admin_password: process.env.SUPERADMIN_PASSWORD,
  super_admin_name: process.env.SUPER_ADMIN_NAME,
  openai_apikey: process.env.OPEN_AI_APIKEY,
};
console.log("Environment variables loaded successfully");
