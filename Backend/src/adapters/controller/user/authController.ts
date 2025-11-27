import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IGoogleSignupUseCase } from "../../../domain/interface/UsecaseInterface/IgoogleSignupUsecase";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ItokenService";
// import { mapToGoogleUser } from "../../../mappers/User/googleMappping";

export class GoogleSignupController {
  constructor(
    private _googleSigninUseCase: IGoogleSignupUseCase,
    private _tokenService: ITokenService
  ) {}

  async googleSignin(req: Request, res: Response): Promise<void> {
    const { token } = req.body;
    

    if (!token) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Google token is required",
      });
      return;
    }

    // Execute use case
    const user = await this._googleSigninUseCase.execute(token);
    console.log(user, "userrr");

    if (user.status?.toLowerCase().includes("block")) {
      res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: "Your account has been blocked by the admin",
      });
      return;
    }

    const payload = { id: user._id, role: user.role, email: user.email };
    const accessToken = this._tokenService.generateAccessToken(payload);
    const refreshToken = this._tokenService.generateRefreshToken(payload);


    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: process.env.MAX_AGE ? Number(process.env.MAX_AGE) : undefined,
    });

 
    // const mappedUser = mapToGoogleUser(user); 
    // console.log(mappedUser)
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Signin successful",
      accessToken,
      user
    });
  }
}
