import { BuddyTravelDto } from "../../dto/BuddyTravel/BuddyTravelDto";

export interface ICreateBuddyTravelUseCase {
  execute(data: BuddyTravelDto): Promise<BuddyTravelDto>;
}
