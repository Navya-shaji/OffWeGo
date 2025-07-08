import { Request, Response } from "express";
import { UserRepository } from "../../repository/user/userRepository";
import { GetAllUsers } from "../../../useCases/admin/user/getAllUserUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";

export class AdminGetAllUserController {
  constructor(private getAllUserUsecase: GetAllUsers) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.getAllUserUsecase.execute();
      res.status(HttpStatus.OK).json({ success: true, users });
    } catch (error) {
      const err= error as Error;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
}
