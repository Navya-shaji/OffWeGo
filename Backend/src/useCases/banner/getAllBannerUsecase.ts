import { Banner } from "../../domain/entities/BannerEntity";
import { IBannerRepository } from "../../domain/interface/Banner/IBannerRepository";
import { mapToBannerDto } from "../../mappers/banner/bannerMappers";

export class GetAllBanners{
    constructor(private bannerRepo:IBannerRepository){}

    async execute():Promise<Banner[]>{
        const banners= await this.bannerRepo.getAllBanner()
        return banners.map(mapToBannerDto)
    }
}