import { Request, Response } from "express";
import { VendorLoginUsecase } from "../../../useCases/vendor/Login/VendorLoginUsecase"; 
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { LoginDTo } from "../../../domain/dto/user/LoginDto"; 

export class VendorLoginController {
  constructor(private vendorLoginUseCase: VendorLoginUsecase) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log(" Login Request:", req.body);

      if (!email || !password) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const loginPayload: LoginDTo = { email, password }; 
      const result = await this.vendorLoginUseCase.execute(loginPayload);
      console.log(" Login Result:", result);

      if (!result) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Invalid credentials or account not approved",
        });
      }

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, 
      });

    
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Login successful",
        accessToken: result.accessToken,
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
