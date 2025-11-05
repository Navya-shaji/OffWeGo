import { BuddyTravelDto } from "../../domain/dto/BuddyTravel/BuddyTravelDto";
import { IBuddyTravelRepository } from "../../domain/interface/BuddyTravel/IBuddyTravelRepository";
import { IGetVendorBuddyPackageUasecase } from "../../domain/interface/BuddyTravel/IGetVendorBuddyPackageusecase";

export class GetVendorBuddyPackageUsecase
  implements IGetVendorBuddyPackageUasecase
{
  constructor(private _buddyRepo: IBuddyTravelRepository) {}
  async execute(vendorId: string): Promise<BuddyTravelDto[]> {
    const allPackages = await this._buddyRepo.getTripsByVendor(vendorId, 0, 10);

    const approvedPackages = allPackages.trips.filter(
      (trip) => trip.status === "APPROVED"
    );

    return approvedPackages;
  }
}
