import cloudinary from "../config/cloudinary";
import fs from "fs";

export class ImageService {
    static async uploadImage(
        filePath: string,
        folder: string = "uploads",
        width?: number,
        height?: number
    ): Promise<string> {
        const transformation = width && height ? [{ width, height, crop: "fill" }] : [];

        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            transformation,
        });

        fs.unlinkSync(filePath); // delete local temp file
        return result.secure_url;
    }

    static async deleteImage(publicId: string) {
        return cloudinary.uploader.destroy(publicId);
    }
}
