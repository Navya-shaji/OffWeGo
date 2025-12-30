import { Request, Response } from "express";
import { IUserProfileUsecase } from "../../../domain/interface/UsecaseInterface/IUserProfileUsecase";
import { IUserProfileEditUsecase } from "../../../domain/interface/UsecaseInterface/IEditProfileOfUserUsecas";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IChangePasswordUseCase } from "../../../domain/dto/User/changePassDto";

export class UserProfileController {
  constructor(
    private _userProfileUsecase: IUserProfileUsecase,
    private _editUserProfileUsecase: IUserProfileEditUsecase,
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
   
      const userId = req.body.userId || req.params.userId || req.user?.id || req.user?.userId;

      const { userId: _, ...userData } = req.body;

      const result = await this._editUserProfileUsecase.execute(
        userId,
        userData
      );
      

      
      if (!result) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to update profile",
        });
      }
      
 
      const phoneValue = result.phone !== undefined && result.phone !== null 
        ? String(result.phone) 
        : result.phone;
      

      const userIdString = result._id?.toString() || userId;
      
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "User profile updated successfully",
        data: {
          id: userIdString,
          username: result.name || userData.name,
          email: result.email,
          phone: phoneValue,
          imageUrl: result.imageUrl,
          status: result.status,
          role: result.role,
          isGoogleUser: result.isGoogleUser,
          location: result.location,
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
   
      const userId = req.user?.id || req.user?.userId;
      
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "User ID not found in token",
        });
      }
      
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
