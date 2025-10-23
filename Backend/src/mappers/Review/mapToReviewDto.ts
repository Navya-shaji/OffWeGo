import { CreateReviewDTO } from "../../domain/dto/Review/createReviewDto";
import { IReview } from "../../domain/entities/ReviewEntity";

export const mapToReviewEntity = (reviews: IReview[]): CreateReviewDTO[] => {
  return reviews.map((review) => ({
    userId: review.userId,
    packageName: review.packageName,
    destination: review.destination,
    description: review.description,
    rating: review.rating,
    photo: review.photo,
  }));
};
