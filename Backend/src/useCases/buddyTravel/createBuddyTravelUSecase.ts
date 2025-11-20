import { BuddyTravelDto } from "../../domain/dto/BuddyTravel/BuddyTravelDto";
import { IBuddyTravelRepository } from "../../domain/interface/BuddyTravel/IBuddyTravelRepository";
import { ICreateBuddyTravelUseCase } from "../../domain/interface/BuddyTravel/ICreateBuddytravelUSecase";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";

export class CreateBuddyTravelUseCase implements ICreateBuddyTravelUseCase {
  constructor(
    private _buddyTravelRepository: IBuddyTravelRepository,
    private _packageRepository: IPackageRepository
  ) {}

  async execute(data: BuddyTravelDto): Promise<BuddyTravelDto> {
    if (!data.title || !data.destination || !data.vendorId) {
      throw new Error("Missing required fields (title, destination, or vendorId)");
    }

    const vendorId = data.vendorId;


    const { totalPackages } = await this._packageRepository.getAllPackagesByVendor(
      vendorId,
      0,
      3
    );


    const { totalTrips } = await this._buddyTravelRepository.getTripsByVendor(
      vendorId,
      0,
      3
    );

    const totalCombined = totalPackages + totalTrips;

    if (totalCombined >= 3) {
      throw new Error(
        "You can create only up to 3 total listings (packages + buddy trips)."
      );
    }


    const created = await this._buddyTravelRepository.createBuddyTrip({
      ...data,
      isApproved: false,
    });



    return created
  }
}
