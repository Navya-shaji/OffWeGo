import { Banner } from "../../entities/BannerEntity";

export interface IBannerCreateUsecase{
    execute(data:Banner):Promise<Banner>
}