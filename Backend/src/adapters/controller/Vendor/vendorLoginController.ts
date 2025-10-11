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
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        code: "VENDOR_BLOCKED",
        message: "Your account has been blocked by the admin",
      });
    }
    const payload = { id: vendor.id, email: vendor.email, role: "vendor" };
    const accessToken = this._tokenService.generateAccessToken(payload);
    const refreshToken = this._tokenService.generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: process.env.MAX_AGE ? Number(process.env.MAX_AGE) : undefined,
    });
    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      vendor,
    });
  }
}
