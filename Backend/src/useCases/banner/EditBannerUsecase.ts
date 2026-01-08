import { BannerDto } from "../../domain/dto/banner/BannerDto";
import { Banner } from "../../domain/entities/BannerEntity";
import { bannerModel } from "../../framework/database/Models/bannerModel";
import { mapToBannerDto } from "../../mappers/Banner/BannerMappers";

export class EditBanner{
    async execute(id:string,updatedData:Banner):Promise<BannerDto|null>{
        const updatedDoc=await (bannerModel).findByIdAndUpdate(id,updatedData)
        return updatedDoc?mapToBannerDto(updatedDoc):null
    }
}