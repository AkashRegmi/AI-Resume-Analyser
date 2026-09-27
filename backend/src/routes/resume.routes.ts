import { Router } from "express";
import { resumeUploader } from "../middlewares/multer.middleware";
import { validate } from "../middlewares/validate.middleware";
import { analyzeResumeSchema } from "../schema/resume.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { analyzeResume } from "../controller/resume.controller";
const router = Router();

router.post(
  "/analyze",
  authMiddleware,

  resumeUploader.single("resume"),

  validate(analyzeResumeSchema),

  analyzeResume,
);

export default router;
