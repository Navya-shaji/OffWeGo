import { Request, Response } from "express";
import cloudinary from "../../../utilities/cloud";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";

export class VendorDocumentController {
  constructor() {}

  async upload(req: Request, res: Response): Promise<void> {
    try {
      const fileStr = req.body.file;

      if (!fileStr) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "No file data provided",
        });
        return;
      }

      const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
        folder: "vendor_documents",
        allowed_formats: ["jpg", "png", "pdf"],
      });

      res.status(HttpStatus.OK).json({
        success: true,
        imageUrl: uploadedResponse.secure_url,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to upload document",
        error
      });
    }
  }
}
