import { Banner } from "../../entities/BannerEntity";

export interface IGetBannerUsecase{
    execute():Promise<Banner[]|null>
}