import { Request, Response } from "express";
import { IUserProfileUsecase } from "../../../domain/interface/UsecaseInterface/IUserProfileUsecase";
import { IUserProfileEditUsecase } from "../../../domain/interface/UsecaseInterface/IEditProfileOfUserUsecas";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IChangePasswordUseCase } from "../../../domain/dto/User/changePassDto";

export class UserProfileController {
  constructor(
    private _userProfileUsecase: IUserProfileUsecase,
    private _editUserProfile: IUserProfileEditUsecase,
    private _changePasswordUsecase: IChangePasswordUseCase
  ) {}

  async GetProfile(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.query;
      if (typeof email !== "string") {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email is required and must be a string",
        });
        return;
      }

      const result = await this._userProfileUsecase.execute({ email });

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
      console.error("Error fetching profile:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch profile",
        error: (error as Error).message,
      });
    }
  }

  async editProfileHandler(req: Request, res: Response) {
    try {
      const userId = req.user?.userId 
      console.log(userId,"djjk")
      const userData = req.body;
console.log(userData)
      const result = await this._editUserProfile.execute(userId, userData);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "User profile updated successfully",
        data: {
          id: result?._id,
          username: result?.name,
          email: result?.email,
          phone: result?.phone,
          imageUrl: result?.imageUrl,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update profile",
        error: (error as Error).message,
      });
    }
  }

  async changePasswordHandler(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { oldPassword, newPassword } = req.body;

      const result = await this._changePasswordUsecase.execute({
        userId,
        oldPassword,
        newPassword,
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        message: result,
      });
    } catch (error) {
      console.error("Error changing password:", error);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
        error: (error as Error).message,
      });
    }
  }
}
