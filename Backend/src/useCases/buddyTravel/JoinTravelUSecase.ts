import { BuddyTravelDto } from "../../domain/dto/BuddyTravel/BuddyTravelDto";
import { IBuddyTravelRepository } from "../../domain/interface/BuddyTravel/IBuddyTravelRepository";
import { IJoinTravelUsecase } from "../../domain/interface/BuddyTravel/IJoinTravelUsecase";

export class JoinTravelUsecase implements IJoinTravelUsecase {
  constructor(private _buddyRepo: IBuddyTravelRepository) {}

  async execute(userId: string, tripId: string): Promise<BuddyTravelDto> {
    
    const updatedTrip = await this._buddyRepo.joinBuddyTrip(tripId, userId);
console.log(updatedTrip,"")
    if (!updatedTrip) {
      throw new Error("Failed to join the trip or trip not found");
    }
    return updatedTrip as BuddyTravelDto;
  }
}
