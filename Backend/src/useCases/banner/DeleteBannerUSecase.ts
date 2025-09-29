import { IDeleteBannerUsecase } from "../../domain/interface/Banner/IDeleteBannerUSecase";
import { bannerModel } from "../../framework/database/Models/bannerModel";

export class DeleteBanner implements IDeleteBannerUsecase{
    async execute(id: string): Promise<{ success: boolean; message: string; }> {
        const result=await bannerModel.findByIdAndDelete(id)

        if(!result){
            throw new Error("Banner not found")
        }
        return {success:true,message:"Banner deleted successfully"}
    }
}