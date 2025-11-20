import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { LoginDTo } from "../../../domain/dto/User/LoginDto";
import { IVendorLoginUsecase } from "../../../domain/interface/Vendor/IVendorLoginUsecase";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ItokenService";

export class VendorLoginController {
  constructor(
    private _vendorLoginUseCase: IVendorLoginUsecase,
    private _tokenService: ITokenService
  ) {}

  async login(req: Request, res: Response) {
  try {
    const { email, password, fcmToken } = req.body;
console.log(fcmToken,"Token controller")
    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const loginPayload: LoginDTo = { email, password };


    const result = await this._vendorLoginUseCase.execute(loginPayload, fcmToken);
    console.log(res)

    if (!result || !result.vendor) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid credentials or account not approved",
      });
    }

    const { vendor, accessToken, refreshToken, } = result;

    if (vendor.isBlocked) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        code: "VENDOR_BLOCKED",
        message: "Your account has been blocked by the admin",
      });
    }

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Login successful",
      vendor,
      accessToken,
      refreshToken,
      fcmToken,
    });

  } catch (error) {
    console.error("Error during vendor login:", error);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error during login",
      error: (error as Error).message,
    });
  }
}

}
