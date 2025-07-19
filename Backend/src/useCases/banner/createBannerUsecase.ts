import { Banner } from "../../domain/entities/BannerEntity";
import { IBannerRepository } from "../../domain/interface/Banner/IBannerRepository";
import { mapToBannerDto } from "../../mappers/banner/bannerMappers";

export class CreateBanner{
    constructor(private bannerRepo:IBannerRepository){}

    async execute(data:Banner):Promise<Banner>{
        const created=await this.bannerRepo.createBanner(data)
        return mapToBannerDto(created)
    }
}