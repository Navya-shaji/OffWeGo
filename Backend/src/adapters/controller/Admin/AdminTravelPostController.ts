import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IListTravelPostsUsecase } from "../../../domain/interface/TravelPost/usecases/IListTravelPostsUsecase";
import { IApproveTravelPostUsecase } from "../../../domain/interface/TravelPost/usecases/IApproveTravelPostUsecase";
import { IRejectTravelPostUsecase } from "../../../domain/interface/TravelPost/usecases/IRejectTravelPostUsecase";

export class AdminTravelPostController {
  constructor(
    private _listTravelPostsUsecase: IListTravelPostsUsecase,
    private _approveTravelPostUsecase: IApproveTravelPostUsecase,
    private _rejectTravelPostUsecase: IRejectTravelPostUsecase
  ) {}

  async listTravelPostsByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, categoryId, destinationId, search } = req.query;
      const statusParam = req.params.status;

      const parsedPage = page ? Number(page) : undefined;
      const parsedLimit = limit ? Number(limit) : undefined;

      const normalizedStatus =
        typeof statusParam === "string" &&
        ["PENDING", "APPROVED", "REJECTED"].includes(statusParam.toUpperCase())
          ? (statusParam.toUpperCase() as "PENDING" | "APPROVED" | "REJECTED")
          : "PENDING";

      const result = await this._listTravelPostsUsecase.execute({
        page: Number.isNaN(parsedPage as number) ? undefined : parsedPage,
        limit: Number.isNaN(parsedLimit as number) ? undefined : parsedLimit,
        categoryId:
          typeof categoryId === "string" && categoryId.trim()
            ? categoryId
            : undefined,
        destinationId:
          typeof destinationId === "string" && destinationId.trim()
            ? destinationId
            : undefined,
        search:
          typeof search === "string" && search.trim() ? search : undefined,
        status: normalizedStatus,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Travel posts fetched successfully.",
        data: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (error) {
      console.error("Error listing travel posts (admin):", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to load travel posts",
      });
    }
  }

  async updateTravelPostStatus(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id?.trim();
      const { status, rejectedReason } = req.body as {
        status?: "APPROVED" | "REJECTED";
        rejectedReason?: string;
      };

      if (!postId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Post id is required",
        });
        return;
      }

      if (!status || !["APPROVED", "REJECTED"].includes(status)) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Invalid status. Must be APPROVED or REJECTED",
        });
        return;
      }

      const adminId = (req.user)?.id;

      const updated =
        status === "APPROVED"
          ? await this._approveTravelPostUsecase.execute(postId, adminId)
          : await this._rejectTravelPostUsecase.execute(
              postId,
              rejectedReason || "Rejected",
              adminId
            );

      res.status(HttpStatus.OK).json({
        success: true,
        message: `Travel post ${status.toLowerCase()} successfully.`,
        data: updated,
      });
    } catch (error) {
      console.error("Error updating travel post status (admin):", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to update travel post status",
      });
    }
  }
}
