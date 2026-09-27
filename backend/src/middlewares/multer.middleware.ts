import fs from "fs";
import path from "path";
import multer from "multer";
import crypto from "crypto";
import { Request } from "express";
import { UploadConfig } from "../interface/uploadConfig.interface";
import { FileUploadError } from "../utils/fileUploadError";

// {
//   "fieldname": "avatar",
//   "originalname": "sunset.png",
//   "encoding": "7bit",
//   "mimetype": "image/png",
//   "destination": "uploads/",
//   "filename": "834dfa1a89c9e88b2b1a92df48d0ab91",
//   "path": "uploads/834dfa1a89c9e88b2b1a92df48d0ab91",
//   "size": 45210
// }

export const storage = (subFolder: string) => {
  return multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
      const uploadDir = path.join(__dirname, "../", "uploads", subFolder);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
      const randomHex = crypto.randomBytes(16).toString("hex");
      const ext = path.extname(file.originalname);
      cb(null, `${file?.fieldname}-${randomHex}${ext}`);
    },
  });
};
export const createUploader = ({
  subFolder,
  allowedTypes,
  allowedMimeTypes,
  maxSizeMB,
}: UploadConfig) => {
  const normalizedTypes = allowedTypes.map((t) =>
    t.toLowerCase().replace(".", ""),
  );
  return multer({
    storage: storage(subFolder),
    limits: {
      fileSize: maxSizeMB * 1024 * 1024,
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb) => {
      const ext = path
        .extname(file.originalname)
        .toLowerCase()
        .replace(".", "");
      if (!normalizedTypes.includes(ext)) {
        return cb(
          new FileUploadError(
            `This field accepts only: ${normalizedTypes.join(", ")}`,
          ),
        );
      }
      if (allowedMimeTypes && !allowedMimeTypes.includes(file.mimetype)) {
        return cb(new FileUploadError("Invalid file type."));
      }

      cb(null, true);
    },
  });
};
export const cleanupUploadedFiles = (req: Request) => {
  let files: Express.Multer.File[] = [];

  if (req.file) {
    // .single()
    files = [req.file];
  } else if (Array.isArray(req.files)) {
    // .array()
    files = req.files;
  } else if (req.files && typeof req.files === "object") {
    // .fields() -> { fieldName: File[] }
    files = Object.values(req.files).flat();
  }

  files.forEach((f) => {
    fs.unlink(f.path, (err) => {
      if (err) console.error(`Failed to delete file ${f.path}:`, err.message);
    });
  });
};
//Usages
// const avatarUploader = createUploader({
//   subFolder: "avatars",
//   allowedTypes: ["jpg", "jpeg", "png"],
//   maxSizeMB: 2,
// });

// // single file under field name "avatar"
// router.post("/avatar", avatarUploader.single("avatar"), uploadAvatar);
// router.post("/docs", docsUploader.array("documents", 3), uploadDocs);
// upload.fields([
//   { name: "profile", maxCount: 1 },
//   { name: "gallery", maxCount: 5 },
//   { name: "documents", maxCount: 3 },
// ]);
// export const studentUpload = createUploader({
//   subFolder: "students",
//   allowedTypes: ["jpg", "jpeg", "png", "webp"],
//   maxSizeMB: 5,
// }).fields([
//   { name: "photo", maxCount: 1 },
//   { name: "citizenshipImage", maxCount: 1 },
// ]);
export const resumeUploader = createUploader({
  subFolder: "resumes",
  allowedTypes: ["pdf", "docx"],
  allowedMimeTypes: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  maxSizeMB: 5,
});
