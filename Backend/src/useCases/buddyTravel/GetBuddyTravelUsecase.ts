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
    console.log(status);
    if (!action) {
      throw new Error("Action is required");
    }

    const normalizedAction = action.toLowerCase();

    if (normalizedAction === "pending") {
      return await this._buddyRepo.findByStatus("PENDING");
    }

    if (normalizedAction === "approved") {
      return await this._buddyRepo.findByStatus("APPROVED");
    }

    if (normalizedAction === "reject") {
      return await this._buddyRepo.findByStatus("REJECTED");
    }

    throw new Error(`Invalid action type: ${action}`);
  }
}
