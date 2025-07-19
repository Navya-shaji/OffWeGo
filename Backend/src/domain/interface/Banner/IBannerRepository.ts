import { IBannerModel } from "../../../framework/database/Models/bannerModel";
import { Banner } from "../../entities/BannerEntity";

export interface IBannerRepository{
    createBanner(data:Banner):Promise<IBannerModel>
    getAllBanner():Promise<IBannerModel[]>
}