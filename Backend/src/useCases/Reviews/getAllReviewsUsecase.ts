import { ReviewRepository } from "../../adapters/repository/Reviews/ReviewRepository";
import { CreateReviewDTO } from "../../domain/dto/Review/CreateReviewDto";
import { IGetReviewUsecase } from "../../domain/interface/Reviews/IgetReviewUsecase";
import { mapToReviewEntity } from "../../mappers/Review/mapToReviewDto";

export class GetReviewUsecase implements IGetReviewUsecase{
    constructor(private _reviewRepo:ReviewRepository){}
    
    async execute(packageId:string): Promise<CreateReviewDTO[] |null> {
        const reviews=await this._reviewRepo.findByPackage(packageId)
        return mapToReviewEntity(reviews)
    }
}