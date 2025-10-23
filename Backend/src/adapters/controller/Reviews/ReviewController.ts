import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ICreateReviewUseCase } from "../../../domain/interface/Reviews/IcreateReviewUsecase";
import { IGetReviewUsecase } from "../../../domain/interface/Reviews/IgetReviewUsecase";

export class ReviewController {
  constructor(private _createReview: ICreateReviewUseCase,
    private _allReviews:IGetReviewUsecase
  ) {}

  async createReview(req: Request, res: Response) {
    const reviewData = req.body;
    const result = await this._createReview.execute(reviewData);
    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
      message: "Review created successfully",
    });
  }

  async getReviews(req:Request,res:Response){
    const  packageId=req.params.packageId
    const result=await this._allReviews.execute(packageId)

    res.status(HttpStatus.OK).json({
      success:true,
      data:result,
      message:"Reviews fetched successfully"
    })
  }
}
