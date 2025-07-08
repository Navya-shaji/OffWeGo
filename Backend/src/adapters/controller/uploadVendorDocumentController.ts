// uploadVendorDocumentController.ts
import { Request, Response } from "express";
import cloudinary from "../../utilities/cloud"; 

export const uploadVendorDocumentController = async (req: Request, res: Response) => {
  try {
    const fileStr = req.body.file;

    if (!fileStr) {
      return res.status(400).json({ success: false, message: "No file data provided" });
    }

    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "vendor_documents",
      allowed_formats: ["jpg", "png", "pdf"],
    });

    return res.status(200).json({
      success: true,
      imageUrl: uploadedResponse.secure_url,
    });

  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};
