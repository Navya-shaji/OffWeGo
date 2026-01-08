import { CreateReviewDTO } from "../../dto/Review/CreateReviewDto"; 

export interface ICreateReviewUseCase {
  execute(review: CreateReviewDTO): Promise<CreateReviewDTO>;
}
