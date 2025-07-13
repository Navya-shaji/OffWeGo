import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { UpdateVendorUsecase } from "../../../useCases/admin/Vendor/updateVendorUsecase";

export class AdminVenodrBlockandUnblockController {
  constructor(private updatevendorusecase: UpdateVendorUsecase) {}

  async updateStatus(req: Request, res: Response): Promise<void> {
  try {
    const vendorId = req.params.id;
    const { isBlocked } = req.body;

    if (typeof isBlocked !== "boolean") {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "`isBlocked` must be a boolean (true or false)",
      });
      return; 
     }

    await this.updatevendorusecase.execute(vendorId, isBlocked);

    res.status(HttpStatus.OK).json({
      success: true,
      message: `Vendor has been ${isBlocked ? "blocked" : "unblocked"} successfully.`,
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

}
