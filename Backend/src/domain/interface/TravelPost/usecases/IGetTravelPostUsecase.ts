import { TravelPostDto } from "../../../dto/TravelPost/TravelPostDto";

export interface IGetTravelPostUsecase {
  execute(identifier: { id?: string; slug?: string }, requesterId?: string | null): Promise<TravelPostDto>;
}
