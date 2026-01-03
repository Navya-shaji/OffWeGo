import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IGetAllUserUsecase } from "../../../domain/interface/Admin/IGetAllUsers";
import { IUpdateUserUseCase } from "../../../domain/interface/Admin/IUpdateUserUseCase";
import { ISearchUserUsecase } from "../../../domain/interface/Admin/ISerachUSerUsecase";
import { success } from "../../../domain/constants/Success";
import { ErrorMessages } from "../../../domain/constants/Error";
import { AppError } from "../../../domain/errors/AppError";

export class AdminUserController {
  constructor(
    private _getAllUserUsecase: IGetAllUserUsecase,
    private _updateUserStatusUseCase: IUpdateUserUseCase,
    private _searchUserUsecase: ISearchUserUsecase
  ) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { users, totalUsers } =
        await this._getAllUserUsecase.execute(page, limit);

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.FETCHED,
        data: users,
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id?.trim();
      const { status } = req.body;

      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ErrorMessages.INVALID_ID,
        });
        return;
      }

      await this._updateUserStatusUseCase.execute(userId, status);

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.UPDATED,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async searchUser(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q;

      if (typeof query !== "string" || !query.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ErrorMessages.INVALID_REQUEST,
        });
        return;
      }

      const users = await this._searchUserUsecase.execute(query.trim());

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.FETCHED,
        data: users,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
