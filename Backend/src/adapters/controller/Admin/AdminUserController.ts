import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IGetAllUser } from "../../../domain/interface/admin/IGetAllUsers";
import { IUpdateUserUseCase } from "../../../domain/interface/admin/IUpdateUserUseCase";

export class AdminUserController {
  constructor(
    private getAllUserUsecase: IGetAllUser,
    private updateUserStatusUseCase: IUpdateUserUseCase
  ) {}


  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page=parseInt(req.query.page as string)|| 1;
      const limit=parseInt(req.query.limit as string )||10
      const { users, totalUsers } = await this.getAllUserUsecase.execute(page,limit);

      res.status(HttpStatus.OK).json({
        success: true,
        users,
        totalUsers,
        currentPage:page,
        totalPages:Math.ceil(totalUsers/limit)
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  } 

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const { status } = req.body;

      await this.updateUserStatusUseCase.execute(userId, status);

      res.status(HttpStatus.OK).json({
        success: true,
        message: `User status updated to ${status}`,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
