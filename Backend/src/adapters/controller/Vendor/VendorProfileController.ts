import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IVendorProfileUseCase } from "../../../domain/interface/vendor/IvendorProfileUsecase";

export class VendorProfileController {
  constructor(private vendorprofileusecase: IVendorProfileUseCase) {}

  async GetProfile(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.query;
      if (typeof email !== "string") {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "email is Required  and must be string",
        });
        return;
      }

      const result = await this.vendorprofileusecase.execute(email);
      if (result) {
        res.status(HttpStatus.OK).json({
          success: true,
          message: "Profile fetched successfully",
          data: result,
        });
      } else {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Profile not found",
        });
      }
    } catch (error) {
      console.error("Error in GetProfile:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
