import { Banner } from "../../../domain/entities/BannerEntity";
import { IBannerRepository } from "../../../domain/interface/Banner/IBannerRepository";
import {
  IBannerModel,
  bannerModel,
} from "../../../framework/database/Models/bannerModel";
import { BaseRepository } from "../BaseRepo/BaseRepo";

export class BannerRepository
  extends BaseRepository<IBannerModel>
  implements IBannerRepository {
  constructor() {
    super(bannerModel);
  }

  async createBanner(data: Banner): Promise<IBannerModel> {
    return this.create(data);
  }

  async getAllBanner(): Promise<IBannerModel[]> {
    return this.model.find().sort({ createdAt: -1 });
  }

  async updateBannerStatus(
    id: string,
    action: boolean
  ): Promise<IBannerModel | null> {
    return this.update(id, { action });
  }
}
