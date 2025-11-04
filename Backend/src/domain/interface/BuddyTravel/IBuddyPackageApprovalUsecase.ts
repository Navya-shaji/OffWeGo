import { BuddyTravel } from "../../entities/BuddyTripEntity";

export interface IAdminBuddyPackageApprovalUseCase {
  execute(
    status?: "Pending" | "approve" | "reject",
    id?: string
  ): Promise<BuddyTravel[] | BuddyTravel | null>;
}
