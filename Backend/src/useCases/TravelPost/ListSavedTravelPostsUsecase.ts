import { IListSavedTravelPostsUsecase } from "../../domain/interface/TravelPost/usecases/IListSavedTravelPostsUsecase";
import { IUserRepository } from "../../domain/interface/UserRepository/IuserRepository";
import { ITravelPostRepository } from "../../domain/interface/TravelPost/ITravelPostRepository";
import { TravelPostDto } from "../../domain/dto/TravelPost/TravelPostDto";
import { mapTravelPostsToDto } from "../../mappers/TravelPost/mapTravelPostToDto";

export class ListSavedTravelPostsUsecase implements IListSavedTravelPostsUsecase {
  constructor(
    private _userRepository: IUserRepository,
    private _travelPostRepository: ITravelPostRepository
  ) { }

  async execute(userId: string): Promise<TravelPostDto[]> {
    if (!userId) {
      throw new Error("User id is required");
    }

    const ids = await this._userRepository.getSavedTravelPostIds(userId);

    if (!ids.length) {
      return [];
    }

    const posts = await this._travelPostRepository.findByIds(ids);
    const dtos = mapTravelPostsToDto(posts);
    return dtos.map(dto => ({ ...dto, isSaved: true }));
  }
}
