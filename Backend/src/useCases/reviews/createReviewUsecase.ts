import { CreateReviewDTO } from "../../domain/dto/Review/createReviewDto";
import { ICreateReviewUseCase } from "../../domain/interface/Reviews/IcreateReviewUsecase";
import { IReviewRepository } from "../../domain/interface/Reviews/IReviewRepository";
import { mapToSingleReviewEntity } from "../../mappers/Review/mapToCreateReviewDto";

export class CreateReviewUseCase implements ICreateReviewUseCase {
  constructor(private _reviewRepo: IReviewRepository) {}

  async execute(review: CreateReviewDTO): Promise<CreateReviewDTO> {
    if (review.rating < 1 || review.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
   
    const existingReview=await this._reviewRepo.findByPackage(review.packageName)
    if(existingReview){
      throw new Error("You have already submitted a review for this package")
    }
    const createdReview = await this._reviewRepo.create(review); 
    return mapToSingleReviewEntity(createdReview); 
  }
}
