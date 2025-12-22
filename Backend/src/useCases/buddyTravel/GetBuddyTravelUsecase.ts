import { BuddyTravelDto } from "../../domain/dto/BuddyTravel/BuddyTravelDto";
import { IBuddyTravelRepository } from "../../domain/interface/BuddyTravel/IBuddyTravelRepository";
import { IBuddyPackageApprovalUsecase } from "../../domain/interface/BuddyTravel/IGetPendingBuddyPAckagesUsecase";
import { mapToBuddyTravelDtoArray } from "../../mappers/BuddyTravel/mapToAllBuddypackages";

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
      const trips = await this._buddyRepo.findByStatus("PENDING");
      return mapToBuddyTravelDtoArray(trips);
    }

    if (normalizedAction === "approved") {
      const trips = await this._buddyRepo.findByStatus("APPROVED");
      return mapToBuddyTravelDtoArray(trips);
    }

    if (normalizedAction === "reject") {
      const trips = await this._buddyRepo.findByStatus("REJECTED");
      return mapToBuddyTravelDtoArray(trips);
    }

    throw new Error(`Invalid action type: ${action}`);
  }
}
