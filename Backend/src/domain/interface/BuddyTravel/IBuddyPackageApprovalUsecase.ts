import { BuddyTravelDto } from "../../dto/BuddyTravel/BuddyTravelDto";

export interface IAdminBuddyPackageApprovalUseCase {
  execute(
    status?: "Pending" | "approve" | "reject",
    id?: string
  ): Promise<BuddyTravelDto[] | BuddyTravelDto | null>;
}
