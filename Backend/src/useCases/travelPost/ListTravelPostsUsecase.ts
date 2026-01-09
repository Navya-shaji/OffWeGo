import { IListTravelPostsUsecase, ListTravelPostQuery } from "../../domain/interface/TravelPost/usecases/IListTravelPostsUsecase";
import { ITravelPostRepository } from "../../domain/interface/TravelPost/ITravelPostRepository";
import { TravelPostDto } from "../../domain/dto/TravelPost/TravelPostDto";
import { mapTravelPostsToDto } from "../../mappers/TravelPost/mapTravelPostToDto";

export class ListTravelPostsUsecase implements IListTravelPostsUsecase {
  constructor(private readonly travelPostRepository: ITravelPostRepository) {}

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
      },
      { page, limit }
    );

    return {
      data: mapTravelPostsToDto(result.data),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
