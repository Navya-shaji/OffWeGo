import { IReview } from "../../entities/ReviewEntity"; 

export interface IReviewRepository {
  create(review: IReview): Promise<IReview>;
  findByPackage(packageName: string): Promise<IReview[]>;
  findByUser(userId: string): Promise<IReview[]>;
  
}
