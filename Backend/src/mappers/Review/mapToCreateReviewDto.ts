import { CreateReviewDTO } from "../../domain/dto/Review/createReviewDto";
import { IReview } from "../../domain/entities/ReviewEntity";

export const mapToSingleReviewEntity = (review: IReview): CreateReviewDTO => ({
  userId: review.userId,
  packageName: review.packageName,
  destination: review.destination,
  description: review.description,
  rating: review.rating,
  photo: review.photo,
});
