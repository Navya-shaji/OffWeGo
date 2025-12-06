import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ICreateReviewUseCase } from "../../../domain/interface/Reviews/IcreateReviewUsecase";
import { IGetReviewUsecase } from "../../../domain/interface/Reviews/IgetReviewUsecase";

export class ReviewController {
  constructor(
    private _createReviewUsecase: ICreateReviewUseCase,
    private _getReviewUsecase: IGetReviewUsecase
  ) {}

  async createReview(req: Request, res: Response) {
    try {
      const reviewData = req.body;
      const result = await this._createReviewUsecase.execute(reviewData);

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: "Review created successfully",
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (err as Error).message || "Failed to create review",
      });
    }
  }

  async getReviews(req: Request, res: Response) {
    try {
      const packageId = req.params.packageId;
      const result = await this._getReviewUsecase.execute(packageId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: "Reviews fetched successfully",
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (err as Error).message || "Failed to fetch reviews",
      });
    }
  }
}
