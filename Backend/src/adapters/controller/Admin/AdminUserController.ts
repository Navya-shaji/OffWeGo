import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IGetAllUser } from "../../../domain/interface/Admin/IGetAllUsers";
import { IUpdateUserUseCase } from "../../../domain/interface/Admin/IUpdateUserUseCase";
import { ISearchUserUsecase } from "../../../domain/interface/Admin/ISerachUSerUsecase";

export class AdminUserController {
  constructor(
    private _getAllUserUsecase: IGetAllUser,
    private _updateUserStatusUseCase: IUpdateUserUseCase,
    private _searchUserUsecase: ISearchUserUsecase
  ) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { users, totalUsers } = await this._getAllUserUsecase.execute(
        page,
        limit
      );

      res.status(HttpStatus.OK).json({
        success: true,
        users,
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
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

      await this._updateUserStatusUseCase.execute(userId, status);

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
  async searchUser(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q;
      if (typeof query !== "string" || !query.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "The query will be string",
        });
        return;
      }
      const users = await this._searchUserUsecase.execute(query);

      res.status(HttpStatus.OK).json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
