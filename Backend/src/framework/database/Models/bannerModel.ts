import { Document,model,ObjectId } from "mongoose";
import { Banner } from "../../../domain/entities/BannerEntity";
import { BannerSchema } from "../Schema/bannerSchema";

export interface  IBannerModel extends Omit<Banner,"id">,Document{
    _id:ObjectId
}
export  const bannerModel=model<IBannerModel>("banner",BannerSchema)