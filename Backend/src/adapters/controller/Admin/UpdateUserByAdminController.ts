import { Request, Response } from "express";
import { UpdateUserUseCase } from "../../../useCases/admin/user/updateUserusecase"; 
import { HttpStatus } from "../../../domain/statusCode/statuscode"; 

export class AdminUpdateUserStatusController {
  constructor(private updateUserStatusUseCase: UpdateUserUseCase) {}

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
