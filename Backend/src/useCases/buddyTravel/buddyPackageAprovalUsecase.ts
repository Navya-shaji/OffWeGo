import { BuddyTravelDto } from "../../domain/dto/BuddyTravel/BuddyTravelDto";
import { IAdminBuddyPackageApprovalUseCase } from "../../domain/interface/BuddyTravel/IBuddyPackageApprovalUsecase";
import { IBuddyTravelRepository } from "../../domain/interface/BuddyTravel/IBuddyTravelRepository";
import { mapToBuddyTravelDtoArray } from "../../mappers/BuddyTravel/mapToAllBuddypackages";
import { mapToBuddyTravelDto } from "../../mappers/BuddyTravel/mapToAllBuddypackages";

export class BuddyTravalAdminApprovalUsecase implements IAdminBuddyPackageApprovalUseCase {
  constructor(private _buddyTravelRepo: IBuddyTravelRepository) {}

  async execute(
    status?: "Pending" | "approve" | "reject",
    id?: string
  ): Promise<BuddyTravelDto[] | BuddyTravelDto | null> {
    if (!status) {
      const results = await this._buddyTravelRepo.findAll();
      // Map from entity to DTO
      return mapToBuddyTravelDtoArray(results);
    }

    const normalizedAction = status.toLowerCase();

    switch (normalizedAction) {
      case "pending": {
        const pendingResults = await this._buddyTravelRepo.findByStatus("PENDING");
        // Map from entity to DTO
        return mapToBuddyTravelDtoArray(pendingResults);
      }

      case "approve": {
        if (!id) throw new Error("BuddyTravel ID is required for approval");
        const approved = await this._buddyTravelRepo.approveBuddyPackage(id);
        // Map from entity to DTO
        return approved ? mapToBuddyTravelDto(approved) : null;
      }

      case "reject": {
        if (!id) throw new Error("BuddyTravel ID is required for rejection");
        const rejected = await this._buddyTravelRepo.rejectBuddyPackage(id);
        // Map from entity to DTO
        return rejected ? mapToBuddyTravelDto(rejected) : null;
      }

      default:
        throw new Error(`Invalid action type: ${status}`);
    }
  }
}
