import { CreateTravelPostDto } from "../../../dto/TravelPost/CreateTravelDto";
import { TravelPostDto } from "../../../dto/TravelPost/TravelPostDto";

export interface ICreateTravelPostUsecase {
  execute(payload: CreateTravelPostDto): Promise<TravelPostDto>;
}
