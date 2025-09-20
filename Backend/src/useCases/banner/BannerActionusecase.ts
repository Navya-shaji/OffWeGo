import { BannerDto } from "../../domain/dto/Banner/BannerDto";
import { IBannerActionUsecase } from "../../domain/interface/Banner/IBannerActionUsecase";
import { IBannerRepository } from "../../domain/interface/Banner/IBannerRepository";
export class BannerActionUsecase implements IBannerActionUsecase {
  constructor(private _bannerRepository: IBannerRepository) {}

  async execute(id: string, action: boolean): Promise<BannerDto | null> {
    return this._bannerRepository.updateBannerStatus(id, action);
  }
}
