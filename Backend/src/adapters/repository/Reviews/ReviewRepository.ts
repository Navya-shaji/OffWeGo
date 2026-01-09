import { IReviewRepository } from "../../../domain/interface/Reviews/IReviewRepository";
import { IReview } from "../../../domain/entities/ReviewEntity";
import {
  ReviewModel,
  IReviewModel,
} from "../../../framework/database/Models/ReviewModel";
import mongoose from "mongoose";

export class ReviewRepository implements IReviewRepository {

  async create(review: IReview): Promise<IReview> {
    const reviewData = {
      ...review,
      userId: new mongoose.Types.ObjectId(review.userId),
    };

    const created = await ReviewModel.create(reviewData);
    return created.toObject();
  }

  async findByPackage(
    packageName: string
  ): Promise<IReviewModel[]> {
    return ReviewModel
      .find({ packageName })
      .populate("userId", "name profileImage")
      .exec();
  }

  async findByPackageAndUser(
    packageName: string,
    userId: string
  ): Promise<IReview | null> {
    const userIdObjectId = new mongoose.Types.ObjectId(userId);

    const review = await ReviewModel
      .findOne({
        packageName,
        userId: userIdObjectId,
      })
      .populate("userId", "name profileImage")
      .exec();

    return review ? review.toObject() : null;
  }

  async findByUser(
    userId: string
  ): Promise<IReviewModel[]> {
    return ReviewModel
      .find({ userId: new mongoose.Types.ObjectId(userId) })
      .exec();
  }
}
