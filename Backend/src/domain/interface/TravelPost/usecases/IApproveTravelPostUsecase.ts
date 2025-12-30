import { TravelPostDto } from "../../../dto/TravelPost/TravelPostDto";

export interface IApproveTravelPostUsecase {
  execute(postId: string, adminId?: string, note?: string): Promise<TravelPostDto>;
}
