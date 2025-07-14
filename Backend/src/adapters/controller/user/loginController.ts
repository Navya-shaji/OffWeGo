import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IUserLoginUseCase } from "../../../domain/interface/usecaseInterface/ILoginUserUseCaseInterface";
import { ITokenService } from "../../../domain/interface/serviceInterface/ItokenService";

export class UserLoginController {
  constructor(
    private loginUserUseCase: IUserLoginUseCase,
    private tokenService: ITokenService
  ) {}

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and password are required",
        });
        return;
      }

      const result = await this.loginUserUseCase.execute({ email, password });
      const user = result.user;

     
      if (user.role?.toLowerCase() === "admin") {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: "Admins are not allowed to log in from user portal",
        });
        return;
      }

      if (user.status?.toLowerCase().includes("block")) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: "Your account has been blocked by the admin",
        });
        return;
      }

      
      const payload = { userId: user.id, role: user.role };
      const accessToken = this.tokenService.generateAccessToken(payload);
      const refreshToken = this.tokenService.generateRefreshToken(payload);

   
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, 
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Login successful",
        accessToken,
        user,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error?.message || "Login failed",
      });
    }
  }
}
