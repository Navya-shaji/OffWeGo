import { IReviewRepository } from "../../../domain/interface/Reviews/IReviewRepository";
import { IReview } from "../../../domain/entities/ReviewEntity";
import {
  ReviewModel,
  IReviewModel,
} from "../../../framework/database/Models/ReviewModel";

export class ReviewRepository implements IReviewRepository {
  async create(review: IReview): Promise<IReviewModel> {
    return await ReviewModel.create(review);
  }

  async findByPackage(packageId: string): Promise<IReviewModel[]> {
    return await ReviewModel.find({ packageId }).populate(
      "userId",
      "name  profileImage"
    );
  }

  async findByUser(userId: string): Promise<IReviewModel[]> {
    return await ReviewModel.find({ userId });
  }
}
