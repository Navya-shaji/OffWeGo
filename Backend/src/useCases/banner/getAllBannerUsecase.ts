import { BannerDto } from "../../domain/dto/banner/BannerDto";
import { IBannerRepository } from "../../domain/interface/Banner/IBannerRepository";
import { mapToBannerDto } from "../../mappers/Banner/BannerMappers";

export class GetAllBanners{
    constructor(private _bannerRepo:IBannerRepository){}

    async execute():Promise<BannerDto[]>{
        const banners= await this._bannerRepo.getAllBanner()
        return banners.map(mapToBannerDto)
    }
}