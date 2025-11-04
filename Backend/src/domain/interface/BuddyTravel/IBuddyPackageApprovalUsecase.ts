import { BuddyTravel } from "../../entities/BuddyTripEntity";

export interface IAdminBuddyPackageApprovalUseCase {
  execute(
    status?: "getPending" | "approve" | "reject",
    id?: string
  ): Promise<BuddyTravel[] | BuddyTravel | null>;
}
