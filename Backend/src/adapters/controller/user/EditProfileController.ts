import { IUserProfileEditUsecase } from "../../../domain/interface/usecaseInterface/IEditProfileOfUserUsecas";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";

export class EditUserProfileController {
  constructor(private editUserProfile: IUserProfileEditUsecase) {}

  async editProfileHandler(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const userData = req.body;

      const result = await this.editUserProfile.execute(userId, userData);
    
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
