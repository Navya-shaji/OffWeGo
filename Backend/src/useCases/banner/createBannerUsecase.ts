import { BannerDto } from "../../domain/dto/Banner/BannerDto";
import { IBannerRepository } from "../../domain/interface/Banner/IBannerRepository";
import { mapToBannerDto } from "../../mappers/Banner/BannerMappers";

export class CreateBanner {
    constructor(private _bannerRepo: IBannerRepository) { }

    async execute(data: BannerDto): Promise<BannerDto> {
        const created = await this._bannerRepo.createBanner(data)
        return mapToBannerDto(created)
    }
}