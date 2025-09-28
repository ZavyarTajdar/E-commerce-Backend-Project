import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (filepath) => {
    try {
        if (!filepath) {
            return null;
        }

        const response = await cloudinary.uploader.upload(filepath, {
            resource_type: "auto",
        })

        fs.unlink(filepath, (err) => {
            if (err) console.error("❌ Error deleting temp file:", err);
        });
        return response;
    } catch (error) {
        if (filepath) {
            fs.unlink(filepath, (err) => {
                if (err) console.error("❌ Error cleaning temp file:", err);
            });
        }
        console.error("Error uploading file to Cloudinary:", error);
        return null;
    }
}

export { uploadOnCloudinary }