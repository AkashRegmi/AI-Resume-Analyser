import express from "express";
import "dotenv/config";
import AuthRouter from "./routes/user.routes";

import { sendSuccess } from "./utils/response";
import { errorMiddleware } from "./middlewares/error.middleware";
import cors from "cors";
import adminRouter from "./routes/admin.routes";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import resumeRouter from "./routes/resume.routes";
//health check
app.get("/", (req, res) => {
  return sendSuccess(res, 200, "Resume analyzerAPI is running");
});
//Routes
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/resume", resumeRouter);
app.use("/api/v1/admin", adminRouter);
app.use(errorMiddleware);
export default app;
