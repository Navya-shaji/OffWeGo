import { Banner } from "../../domain/entities/BannerEntity";
import { IBannerRepository } from "../../domain/interface/Banner/IBannerRepository";
import { mapToBannerDto } from "../../mappers/banner/bannerMappers";

export class CreateBanner{
    constructor(private _bannerRepo:IBannerRepository){}

    async execute(data:Banner):Promise<Banner>{
        const created=await this._bannerRepo.createBanner(data)
        return mapToBannerDto(created)
    }
}