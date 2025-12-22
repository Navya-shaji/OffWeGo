import { BuddyTravelDto } from "../../domain/dto/BuddyTravel/BuddyTravelDto";
import { IBuddyTravelRepository } from "../../domain/interface/BuddyTravel/IBuddyTravelRepository";
import { IGetAllBuddyPackageUsecase } from "../../domain/interface/BuddyTravel/IgetAllBuddypackageUsecase";
import { mapToBuddyTravelDtoArray } from "../../mappers/BuddyTravel/mapToAllBuddypackages";

export class GetAllBuddyTravelUsecase implements IGetAllBuddyPackageUsecase {
  constructor(private _buddyRepo: IBuddyTravelRepository) {}

  async execute(categoryId?: string, page: number = 1, limit: number = 10): Promise<{
    packages: BuddyTravelDto[];
    totalPackages: number;
  }> {
    const skip = (page - 1) * limit;
    
    let result;
    if (categoryId) {
      result = await this._buddyRepo.getBuddyTripsByCategoryId(categoryId, skip, limit);
    } else {
      const allTrips = await this._buddyRepo.findByStatus("APPROVED");
      const totalTrips = allTrips.length;
      const trips = allTrips.slice(skip, skip + limit);
      result = { trips, totalTrips };
    }
    
    const packages = mapToBuddyTravelDtoArray(result.trips);
    
    // Add remaining slots and total joined
    const packagesWithSlots = packages.map(pkg => ({
      ...pkg,
      totalJoined: pkg.joinedUsers?.length || 0,
      remainingSlots: pkg.maxPeople - (pkg.joinedUsers?.length || 0),
    }));
    
    return {
      packages: packagesWithSlots,
      totalPackages: result.totalTrips,
    };
  }
}
