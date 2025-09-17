import { IBannerModel } from "../../../framework/database/Models/bannerModel";

export interface IBannerActionUsecase {
  execute(id: string, action: boolean): Promise<IBannerModel | null>;
}
