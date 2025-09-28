import { Banner } from "../../entities/BannerEntity";

export interface IEditBannerUsecase {
  execute(id: string, updatedData: Banner): Promise<Banner | null>;
}
