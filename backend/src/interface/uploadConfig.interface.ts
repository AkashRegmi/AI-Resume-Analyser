export interface UploadConfig {
  subFolder: string; // e.g. "avatars", "documents"
  allowedTypes: string[]; // e.g. ["pdf"] or ["jpg", "jpeg", "png"]
  allowedMimeTypes?: string[];
  maxSizeMB: number; // e.g. 5
}
