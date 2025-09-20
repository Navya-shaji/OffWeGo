import { BannerDto } from "../../dto/Banner/BannerDto";

export interface IBannerActionUsecase {
  execute(id: string, action: boolean): Promise<BannerDto | null>;
}
