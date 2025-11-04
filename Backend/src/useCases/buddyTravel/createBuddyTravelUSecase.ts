import { BuddyTravelDto } from "../../domain/dto/BuddyTravel/BuddyTravelDto";
import { IBuddyTravelRepository } from "../../domain/interface/BuddyTravel/IBuddyTravelRepository";
import { ICreateBuddyTravelUseCase } from "../../domain/interface/BuddyTravel/ICreateBuddytravelUSecase";
import { mapToBuddyTravelDto } from "../../mappers/BuddyTravel/mapTobuddyTravelDto";


export class CreateBuddyTravelUseCase implements ICreateBuddyTravelUseCase {
  constructor(private _buddyTravelRepository: IBuddyTravelRepository) {}

  async execute(data: BuddyTravelDto): Promise<BuddyTravelDto> {
    if (!data.title || !data.destination ) {
      throw new Error("Missing required fields");
    } 

    const created = await this._buddyTravelRepository.createBuddyTrip(data);
      console.log("✅ Repository returned:", created);
    return mapToBuddyTravelDto( created as any);
  }
}
