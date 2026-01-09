import { CreateReviewDTO } from "../../dto/Review/CreateReviewDto";

export interface IGetReviewUsecase{
    execute(packageId:string):Promise<CreateReviewDTO[] | null>
}