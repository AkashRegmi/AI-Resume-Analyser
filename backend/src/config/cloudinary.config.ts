import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";
cloudinary.config({
  cloud_name: env.cloud_name as string,
  api_key: env.cloud_api_key as string,
  api_secret: env.cloud_api_secrete as string,
});
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}
export async function handleUpload(file: any) {
  try {
    const res = await cloudinary.uploader.upload(file, {
      folder: "hostel",
      use_filename: true,
      unique_filename: true,
    });
    console.log("function", res);
    return res;
  } catch (error) {
    console.log(error);
  }
}
export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder = "hostel-management",
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error("Cloudinary upload failed"));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );
    stream.end(buffer);
  });
};
export const deleteFromCloudinary = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "auto",
  });
};
export default cloudinary;
