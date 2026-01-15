import { ITravelPostRepository } from "../../domain/interface/TravelPost/ITravelPostRepository";
import { IGetTravelPostUsecase } from "../../domain/interface/TravelPost/usecases/IGetTravelPostUsecase";
import { TravelPostDto } from "../../domain/dto/TravelPost/TravelPostDto";
import { mapTravelPostToDto } from "../../mappers/TravelPost/mapTravelPostToDto";

export class GetTravelPostUsecase implements IGetTravelPostUsecase {
  constructor(private _travelPostRepository: ITravelPostRepository) { }

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

    // Increment views only if it's a new viewer (if logged in)
    const oldViews = post.metrics.views;
    await this._travelPostRepository.incrementViews(post.id!, requesterId || undefined);

    // We fetch the post again to get updated metric or we can manually adjust
    // To be efficient, we only increment the DTO view if it's likely a new view
    const dto = mapTravelPostToDto(post);

    // Simple heuristic for immediate UI feedback: 
    // If not logged in, increment. 
    // If logged in, check if user was already in viewedBy.
    const alreadyViewed = requesterId && post.viewedBy?.includes(requesterId);
    if (!requesterId || !alreadyViewed) {
      dto.metrics = {
        ...dto.metrics,
        views: oldViews + 1,
      };
    }

    return dto;
  }
}
