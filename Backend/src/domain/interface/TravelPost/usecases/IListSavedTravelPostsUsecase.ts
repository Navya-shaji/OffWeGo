import { TravelPostDto } from "../../../dto/TravelPost/TravelPostDto";

export interface IListSavedTravelPostsUsecase {
  execute(userId: string): Promise<TravelPostDto[]>;
}
