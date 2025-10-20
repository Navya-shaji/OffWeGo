import { CreateReviewDTO } from "../../dto/Review/createReviewDto";

export interface IGetReviewUsecase{
    execute(packageId:string):Promise<CreateReviewDTO[] | null>
}