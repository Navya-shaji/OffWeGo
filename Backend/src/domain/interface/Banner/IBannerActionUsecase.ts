import { BannerDto } from "../../dto/banner/BannerDto";

export interface IBannerActionUsecase {
  execute(id: string, action: boolean): Promise<BannerDto | null>;
}
