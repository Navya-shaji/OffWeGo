import { Banner } from "../../domain/entities/BannerEntity";
import { IBannerModel } from "../../framework/database/Models/bannerModel";

export const mapToBannerDto=(doc:IBannerModel):Banner=>({
    title:doc.title,
    Banner_video_url:doc.Banner_video_url,
    action:doc.action
})