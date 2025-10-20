import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ICreateReviewUseCase } from "../../../domain/interface/Reviews/IcreateReviewUsecase";

export class ReviewController {
  constructor(private _createReview: ICreateReviewUseCase) {}

  async createReview(req: Request, res: Response) {
    const reviewData = req.body;
    const result = await this._createReview.execute(reviewData);
    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
      message: "Review created successfully",
    });
  }
}
