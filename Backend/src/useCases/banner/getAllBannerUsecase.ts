import { Banner } from "../../domain/entities/BannerEntity";
import { IBannerRepository } from "../../domain/interface/Banner/IBannerRepository";
import { mapToBannerDto } from "../../mappers/Banner/bannerMappers";

export class GetAllBanners{
    constructor(private _bannerRepo:IBannerRepository){}

    async execute():Promise<Banner[]>{
        const banners= await this._bannerRepo.getAllBanner()
        return banners.map(mapToBannerDto)
    }
}