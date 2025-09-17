import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { LoginDTo } from "../../../domain/dto/user/LoginDto";
import { IVendorLoginUsecase } from "../../../domain/interface/Vendor/IVendorLoginUsecase"; 

export class VendorLoginController {
  constructor(private _vendorLoginUseCase: IVendorLoginUsecase) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const loginPayload: LoginDTo = { email, password };
      const result = await this._vendorLoginUseCase.execute(loginPayload);
      const vendor = result?.vendor;

      if (!vendor) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Invalid credentials or account not approved",
        });
      }
      if (vendor.isBlocked) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          code: "VENDOR_BLOCKED",
          message: "Your account has been blocked by the admin ",
        });
        return;
      }

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: process.env.MAX_AGE ? Number(process.env.MAX_AGE) : undefined,
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Login successful",
        accessToken: result.accessToken,
         refreshToken: result.refreshToken,
        vendor: result.vendor,
      });
    } catch (err) {
      console.error(" Login Error:", err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Login failed",
      });
    }
  }
}
