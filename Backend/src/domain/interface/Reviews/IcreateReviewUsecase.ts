import { CreateReviewDTO } from "../../dto/Review/createReviewDto"; 

export interface ICreateReviewUseCase {
  execute(review: CreateReviewDTO): Promise<CreateReviewDTO>;
}
