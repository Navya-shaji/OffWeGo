import { TravelPostDto } from "../../../dto/TravelPost/TravelPostDto";

export interface IApproveTravelPostUsecase {
  execute(postId: string): Promise<TravelPostDto>;
}
