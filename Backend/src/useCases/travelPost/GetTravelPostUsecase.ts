import { ITravelPostRepository } from "../../domain/interface/TravelPost/ITravelPostRepository";
import { IGetTravelPostUsecase } from "../../domain/interface/TravelPost/usecases/IGetTravelPostUsecase";
import { TravelPostDto } from "../../domain/dto/TravelPost/TravelPostDto";
import { mapTravelPostToDto } from "../../mappers/TravelPost/mapTravelPostToDto";

export class GetTravelPostUsecase implements IGetTravelPostUsecase {
  constructor(private  _travelPostRepository: ITravelPostRepository) {}

  async execute(
    identifier: { id?: string; slug?: string },
    requesterId?: string | null
  ): Promise<TravelPostDto> {
    const { id, slug } = identifier;

    if (!id && !slug) {
      throw new Error("Post id or slug is required");
    }

    const post = id
      ? await this._travelPostRepository.findById(id)
      : await this._travelPostRepository.findBySlug(slug!);

    if (!post) {
      throw new Error("Travel post not found");
    }

    const canViewPrivate = requesterId && requesterId === post.authorId;

    if (post.status !== "APPROVED" && !canViewPrivate) {
      throw new Error("Travel post is not available");
    }

    await this._travelPostRepository.incrementViews(post.id!);

    const dto = mapTravelPostToDto(post);
    dto.metrics = {
      ...dto.metrics,
      views: dto.metrics.views + 1,
    };

    return dto;
  }
}
