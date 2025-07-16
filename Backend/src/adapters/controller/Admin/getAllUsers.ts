import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IGetAllUser } from "../../../domain/interface/admin/IGetAllUsers";

export class AdminGetAllUserController {
  constructor(private getAllUserUsecase: IGetAllUser) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
     

      const { users, totalUsers } = await this.getAllUserUsecase.execute({
        skip,
        limit,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        users,
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (error as Error).message });
    }
  }
}
