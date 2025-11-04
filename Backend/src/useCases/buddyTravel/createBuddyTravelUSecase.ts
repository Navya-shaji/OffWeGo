import { BuddyTravelDto } from "../../domain/dto/BuddyTravel/BuddyTravelDto";
import { IBuddyTravelRepository } from "../../domain/interface/BuddyTravel/IBuddyTravelRepository";
import { ICreateBuddyTravelUseCase } from "../../domain/interface/BuddyTravel/ICreateBuddytravelUSecase";
import { mapToBuddyTravelDto } from "../../mappers/BuddyTravel/mapTobuddyTravelDto";


export class CreateBuddyTravelUseCase implements ICreateBuddyTravelUseCase {
  constructor(private _buddyTravelRepository: IBuddyTravelRepository) {}

  async execute(data: BuddyTravelDto): Promise<BuddyTravelDto> {
    if (!data.title || !data.destination || !data.price) {
      throw new Error("Missing required fields");
    }

    const created = await this._buddyTravelRepository.createBuddyTrip(data);
    return mapToBuddyTravelDto( created as any);
  }
}
