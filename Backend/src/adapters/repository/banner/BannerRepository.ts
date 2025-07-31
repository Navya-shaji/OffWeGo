import { Banner } from "../../../domain/entities/BannerEntity";
import { IBannerRepository } from "../../../domain/interface/Banner/IBannerRepository";
import { IBannerModel,bannerModel } from "../../../framework/database/Models/bannerModel";

export class BannerRepository implements IBannerRepository{
    async createBanner(data: Banner): Promise<IBannerModel> {
        return await bannerModel.create(data)
    }
    async getAllBanner(): Promise<IBannerModel[]> {
        return  bannerModel.find()
    }
}