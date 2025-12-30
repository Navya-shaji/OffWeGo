import { IListSavedTravelPostsUsecase } from "../../domain/interface/TravelPost/usecases/IListSavedTravelPostsUsecase";
import { IUserRepository } from "../../domain/interface/UserRepository/IuserRepository";
import { ITravelPostRepository } from "../../domain/interface/TravelPost/ITravelPostRepository";
import { TravelPostDto } from "../../domain/dto/TravelPost/TravelPostDto";
import { mapTravelPostsToDto } from "../../mappers/TravelPost/mapTravelPostToDto";

export class ListSavedTravelPostsUsecase implements IListSavedTravelPostsUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly travelPostRepository: ITravelPostRepository
  ) {}

  async execute(userId: string): Promise<TravelPostDto[]> {
    if (!userId) {
      throw new Error("User id is required");
    }

    const ids = await this.userRepository.getSavedTravelPostIds(userId);

    if (!ids.length) {
      return [];
    }

    const posts = await this.travelPostRepository.findByIds(ids);
    return mapTravelPostsToDto(posts);
  }
}
