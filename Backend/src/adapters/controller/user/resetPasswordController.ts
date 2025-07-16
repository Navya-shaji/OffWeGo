import { Request, Response } from "express";
import { ResetPasswordUseCase } from "../../../useCases/user/Login/ResetPasswordUseCase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IResetPasswordUseCase } from "../../../domain/interface/usecaseInterface/IResetPasswordUseCase";

export class UserResetPasswordController {
  constructor(private resetPasswordUseCase: IResetPasswordUseCase) {}

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { email, newPassword } = req.body;

    if (
      !email ||
      !newPassword ||
      typeof email !== "string" ||
      typeof newPassword !== "string"
    ) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:
          "Email, OTP, and new password are required and must be valid strings",
      });
      return;
    }

    try {
      await this.resetPasswordUseCase.execute(email, newPassword);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: (error as Error).message || "Password reset failed",
      });
    }
  }
}
