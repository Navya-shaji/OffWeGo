import { BuddyTravelDto } from "../../domain/dto/BuddyTravel/BuddyTravelDto";
import { IBuddyTravelRepository } from "../../domain/interface/BuddyTravel/IBuddyTravelRepository";
import { IGetAllBuddyPackageUsecase } from "../../domain/interface/BuddyTravel/IgetAllBuddypackageUsecase";

export class GetAllBuddyTravelUsecase implements IGetAllBuddyPackageUsecase {
  constructor(private _buddyRepo: IBuddyTravelRepository) {}

  async execute(): Promise<BuddyTravelDto[]> {
    const packages = await this._buddyRepo.findByStatus("APPROVED");
    return packages;
  }
}
