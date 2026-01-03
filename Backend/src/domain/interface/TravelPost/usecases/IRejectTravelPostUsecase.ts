import { TravelPostDto } from "../../../dto/TravelPost/TravelPostDto";

export interface IRejectTravelPostUsecase {
  execute(postId: string, reason: string): Promise<TravelPostDto>;
}
