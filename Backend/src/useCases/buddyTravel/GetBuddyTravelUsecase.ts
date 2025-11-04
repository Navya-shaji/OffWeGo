import { BuddyTravelDto } from "../../domain/dto/BuddyTravel/BuddyTravelDto";
import { IBuddyTravelRepository } from "../../domain/interface/BuddyTravel/IBuddyTravelRepository";
import { IBuddyPackageApprovalUsecase } from "../../domain/interface/BuddyTravel/IGetPendingBuddyPAckagesUsecase";

export class GetBuddyTravelUsecase implements IBuddyPackageApprovalUsecase {
  constructor(private _buddyRepo: IBuddyTravelRepository) {}

  async execute(
    action: string,
    buddyId?: string,
    status?: string
  ): Promise<BuddyTravelDto[] | BuddyTravelDto | null> {
    console.log(status)
    if (!action) {
      throw new Error("Action is required");
    }

    const normalizedAction = action.toLowerCase();

    if (normalizedAction === "pending") {
      return await this._buddyRepo.findByStatus("PENDING");
    }

    if (normalizedAction === "approve") {
      if (!buddyId) throw new Error("BuddyTravel ID is required for approval");
      return await this._buddyRepo.approveBuddyPackage(buddyId);
    }

    if (normalizedAction === "reject") {
      if (!buddyId) throw new Error("BuddyTravel ID is required for rejection");
      return await this._buddyRepo.rejectBuddyPackage(buddyId);
    }

    throw new Error(`Invalid action type: ${action}`);
  }
}
