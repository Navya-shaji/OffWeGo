import { Request, Response } from "express";
import { IUserProfileUsecase } from "../../../domain/interface/usecaseInterface/IUserProfileUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";

export class UserProfileController {
  constructor(private userProfileUsecase: IUserProfileUsecase) {}

  async GetProfile(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.query;  
      console.log("Query email:", req.query.email); // Confirm the email reaches controller


      if (typeof email !== "string") {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email is required and must be a string",
        });
        return;
      }

      const result = await this.userProfileUsecase.execute({ email });

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
}
