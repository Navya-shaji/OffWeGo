import { Banner } from "../../domain/entities/BannerEntity";
import { bannerModel } from "../../framework/database/Models/bannerModel";
import { mapToBannerDto } from "../../mappers/banner/bannerMappers";

export class EditBanner{
    async execute(id:string,updatedData:Banner):Promise<Banner|null>{
        const updatedDoc=await bannerModel.findByIdAndUpdate(id,updatedData)

        return updatedDoc?mapToBannerDto(updatedDoc):null
    }
}