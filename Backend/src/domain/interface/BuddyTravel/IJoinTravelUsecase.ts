import { BuddyTravelDto } from "../../dto/BuddyTravel/BuddyTravelDto";

export interface IJoinTravelUsecase{
    execute(userId: string, tripId: string):Promise<BuddyTravelDto>
}