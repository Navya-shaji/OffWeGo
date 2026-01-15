import { DestinationDto } from "../../dto/Destination/DestinationDto";

export interface IGetNearbyDestinationUsecase {
  execute(lat: number, lng: number, radiusInKm: number): Promise<DestinationDto[]>;
}