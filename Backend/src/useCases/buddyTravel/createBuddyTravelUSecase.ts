import { BuddyTravelDto } from "../../domain/dto/BuddyTravel/BuddyTravelDto";
import { BuddyTravel } from "../../domain/entities/BuddyTripEntity";
import { IBuddyTravelRepository } from "../../domain/interface/BuddyTravel/IBuddyTravelRepository";
import { ICreateBuddyTravelUseCase } from "../../domain/interface/BuddyTravel/ICreateBuddytravelUSecase";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";
import { mapToBuddyTravelDto } from "../../mappers/BuddyTravel/mapToAllBuddypackages";

export class CreateBuddyTravelUseCase implements ICreateBuddyTravelUseCase {
  constructor(
    private _buddyTravelRepository: IBuddyTravelRepository,
    private _packageRepository: IPackageRepository
  ) {}

  async execute(data: BuddyTravelDto): Promise<BuddyTravelDto> {
    if (!data.title || !data.destination || !data.vendorId || !data.categoryId) {
      throw new Error("Missing required fields (title, destination, categoryId, or vendorId)");
    }

    if (!data.location) {
      throw new Error("Location is required");
    }

    if (!data.startDate || !data.endDate) {
      throw new Error("Start date and end date are required");
    }

    // Validate dates
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const now = new Date();

    if (endDate <= startDate) {
      throw new Error("End date must be after start date");
    }

    // Calculate initial trip status
    let tripStatus: "UPCOMING" | "ONGOING" | "COMPLETED" = "UPCOMING";
    if (now >= startDate && now <= endDate) {
      tripStatus = "ONGOING";
    } else if (now > endDate) {
      tripStatus = "COMPLETED";
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

    // Convert DTO to Entity format (remove category object, keep only categoryId as string)
    const entityData: BuddyTravel = {
      title: data.title,
      destination: data.destination,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
      price: data.price,
      maxPeople: data.maxPeople,
      joinedUsers: data.joinedUsers || [],
      description: data.description,
      categoryId: data.categoryId,
      category: typeof data.category === 'object' ? data.category?.name : data.category, // Convert category object to string if needed
      tripStatus,
      status: "PENDING",
      vendorId: data.vendorId,
      isApproved: false,
      includedFeatures: data.includedFeatures || {
        food: false,
        stay: false,
        transport: false,
        activities: false,
        guide: false,
        insurance: false,
      },
      itinerary: data.itinerary || [],
      hotels: data.hotels || [],
      activities: data.activities || [],
    };

    const created = await this._buddyTravelRepository.createBuddyTrip(entityData);

    // Map entity back to DTO
    return mapToBuddyTravelDto(created);
  }
}
