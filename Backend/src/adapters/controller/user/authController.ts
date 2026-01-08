import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IGoogleSignupUseCase } from "../../../domain/interface/UsecaseInterface/IgoogleSignupUsecase";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ItokenService";
import { ICreateWalletUsecase } from "../../../domain/interface/Wallet/ICreateUserWalletUsecase";

export class GoogleSignupController {
  constructor(
    private _googleSignupUsecase: IGoogleSignupUseCase,
    private _tokenService: ITokenService,
    private _createWalletUsecase: ICreateWalletUsecase
  ) {}

  async googleSignin(req: Request, res: Response): Promise<void> {
    try {
      const { token, fcmToken } = req.body;
      
      if (!token) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Google token is required",
        });
        return;
      }

    
      const user = await this._googleSignupUsecase.execute(token, fcmToken || "");
     

    
      const mappedUser = user as any;
      const userId = mappedUser.id || mappedUser._id?.toString();
      
     
      
      if (!user || !userId) {
        console.error("❌ User or userId is missing:", { user: !!user, userId: !!userId });
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "User information is incomplete or missing.",
        });
        return;
      }

     
      try {
        await this._createWalletUsecase.execute(userId, "user");
      } catch (walletErr) {
        console.error("Wallet creation on Google signin failed:", walletErr);
      }

      // IMPORTANT: use userId key to match auth middleware expectations (req.user.userId)
      const payload = {
        userId: userId,
        role: mappedUser.role || user.role || 'user',
        email: mappedUser.email || user.email,
      };
      
      

      const accessToken = this._tokenService.generateAccessToken(payload);
      const refreshToken = this._tokenService.generateRefreshToken(payload);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: process.env.MAX_AGE ? Number(process.env.MAX_AGE) : undefined,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Signin successful",
        accessToken,
        user,
      });
    } catch (error: any) {
      console.error("Google Signin error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error?.message || "Google Signin failed",
        error: error?.message || "Unknown error occurred",
      });
    }
  }
}
