import { BuddyTravelDto } from "../../dto/BuddyTravel/BuddyTravelDto";

export interface IBuddyPackageApprovalUsecase {
    execute(
        action: string,
        buddyId?: string,
        status?: string
    ): Promise<BuddyTravelDto | BuddyTravelDto[] | null>;
}
