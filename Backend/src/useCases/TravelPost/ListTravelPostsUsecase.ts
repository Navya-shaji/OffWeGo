import { IListTravelPostsUsecase, ListTravelPostQuery } from "../../domain/interface/TravelPost/usecases/IListTravelPostsUsecase";
import { ITravelPostRepository, SortOption } from "../../domain/interface/TravelPost/ITravelPostRepository";
import { TravelPostDto } from "../../domain/dto/TravelPost/TravelPostDto";
import { mapTravelPostsToDto } from "../../mappers/TravelPost/mapTravelPostToDto";
import { IUserRepository } from "../../domain/interface/UserRepository/IuserRepository";

export class ListTravelPostsUsecase implements IListTravelPostsUsecase {
  constructor(
    private readonly travelPostRepository: ITravelPostRepository,
    private readonly userRepository: IUserRepository
  ) { }

  async execute(query: ListTravelPostQuery): Promise<{
    data: TravelPostDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 50) : 10;

    const result = await this.travelPostRepository.list(
      {
        status: query.status,
        categoryId: query.categoryId,
        destinationId: query.destinationId,
        authorId: query.authorId,
        search: query.search,
        sortBy: query.sortBy as SortOption,
      },
      { page, limit }
    );

    const dtos = mapTravelPostsToDto(result.data);

    if (query.requesterId) {
      const savedIds = await this.userRepository.getSavedTravelPostIds(query.requesterId);
      dtos.forEach(dto => {
        dto.isSaved = savedIds.includes(dto.id);
      });
    }

    return {
      data: dtos,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
