import { model, ObjectId ,Document} from "mongoose";
import { IReview } from "../../../domain/entities/ReviewEntity";
import { ReviewSchema } from "../Schema/ReviewSchema";

export interface IReviewModel extends Omit<IReview,"id">,Document{
    _id:ObjectId
}

export const ReviewModel=model<IReviewModel>("Review",ReviewSchema)