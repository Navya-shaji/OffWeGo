import { BuddyTravel } from "../../domain/entities/BuddyTripEntity";
import { IAdminBuddyPackageApprovalUseCase } from "../../domain/interface/BuddyTravel/IBuddyPackageApprovalUsecase";
import { IBuddyTravelRepository } from "../../domain/interface/BuddyTravel/IBuddyTravelRepository";

export class BuddyTravalAdminApprovalUsecase implements IAdminBuddyPackageApprovalUseCase {
  constructor(private _buddyTravelRepo: IBuddyTravelRepository) {}

  async execute(
    status?: "getPending" | "approve" | "reject",
    id?: string
  ): Promise<BuddyTravel[] | BuddyTravel | null> {
    if (!status) throw new Error("Action is required");

    const normalizedAction = status.toLowerCase(); 

    switch (normalizedAction) {
      case "getpending":
        return await this._buddyTravelRepo.findByStatus("PENDING");

      case "approve":
        if (!id) throw new Error("BuddyTravel ID is required for approval");
        return await this._buddyTravelRepo.approveBuddyPackage(id);

      case "reject":
        if (!id) throw new Error("BuddyTravel ID is required for rejection");
        return await this._buddyTravelRepo.rejectBuddyPackage(id);

      default:
        throw new Error(`Invalid action type: ${status}`);
    }
  }
}
