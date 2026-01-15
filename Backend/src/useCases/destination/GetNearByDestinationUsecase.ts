import { DestinationDto } from "../../domain/dto/Destination/DestinationDto";
import { IDestinationRepository } from "../../domain/interface/Admin/IDestinationInterface";
import { IGetNearbyDestinationUsecase } from "../../domain/interface/Destination/IGetNearByDestinationUSecase";

export class GetNearByDestinationUSecase
  implements IGetNearbyDestinationUsecase
{
  constructor(private _destinationRepo: IDestinationRepository) {}

  async execute(
    lat: number,
    lng: number,
    radiusInKm: number
  ): Promise<DestinationDto[]> {
    return await this._destinationRepo.getNearbyDestinations(
      lat,
      lng,
      radiusInKm
    );
  }
}
