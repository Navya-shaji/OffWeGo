import { IRejectTravelPostUsecase } from "../../domain/interface/TravelPost/usecases/IRejectTravelPostUsecase";
import { ITravelPostRepository } from "../../domain/interface/TravelPost/ITravelPostRepository";
import { TravelPostDto } from "../../domain/dto/TravelPost/TravelPostDto";
import { mapTravelPostToDto } from "../../mappers/TravelPost/mapTravelPostToDto";

export class RejectTravelPostUsecase implements IRejectTravelPostUsecase {
  constructor(private  _travelPostRepository: ITravelPostRepository) {}

  async execute(postId: string, reason: string): Promise<TravelPostDto> {
    if (!postId) {
      throw new Error("Post id is required");
    }

    if (!reason?.trim()) {
      throw new Error("Rejection reason is required");
    }

    const post = await this._travelPostRepository.findById(postId);

    if (!post) {
      throw new Error("Travel post not found");
    }

    const updated = await this._travelPostRepository.updateStatus(postId, "REJECTED", reason.trim());

    if (!updated) {
      throw new Error("Failed to reject travel post");
    }

    return mapTravelPostToDto(updated);
  }
}
