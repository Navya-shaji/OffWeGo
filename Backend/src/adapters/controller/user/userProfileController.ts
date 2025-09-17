import { Request, Response } from "express";
import { IUserProfileUsecase } from "../../../domain/interface/UsecaseInterface/IUserProfileUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IUserProfileEditUsecase } from "../../../domain/interface/UsecaseInterface/IEditProfileOfUserUsecas";

export class UserProfileController {
  constructor(private _userProfileUsecase: IUserProfileUsecase,
    private _editUserProfile: IUserProfileEditUsecase
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
      console.error("Error in GetProfile:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

   async editProfileHandler(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const userData = req.body;

      const result = await this._editUserProfile.execute(userId, userData);
    
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "User Profile Updated successfully",
        data: {
          id: result?._id,
          username: result?.name,
          email: result?.email,
          phone: result?.phone,
          imageUrl: result?.imageUrl,
        },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  }
}
