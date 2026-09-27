import nodemailer from "nodemailer";
import pug from "pug";
import path from "path";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.email.host,
  port: env.email.port,
  auth: {
    user: env.email.user,
    pass: env.email.password,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  template: string,
  data: Record<string, unknown>,
): Promise<void> => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "templates",
    "email",
    `${template}.pug`,
  );
  const html = pug.renderFile(templatePath, data);
  await transporter.sendMail({
    from: env.email.user,
    to,
    subject,
    html,
  });
};
