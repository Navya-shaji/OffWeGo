import { IApproveTravelPostUsecase } from "../../domain/interface/TravelPost/usecases/IApproveTravelPostUsecase";
import { ITravelPostRepository } from "../../domain/interface/TravelPost/ITravelPostRepository";
import { TravelPostDto } from "../../domain/dto/TravelPost/TravelPostDto";
import { mapTravelPostToDto } from "../../mappers/TravelPost/mapTravelPostToDto";


export class ApproveTravelPostUsecase implements IApproveTravelPostUsecase {
  constructor(private  _travelPostRepository: ITravelPostRepository) {}

  async execute(postId: string): Promise<TravelPostDto> {
    if (!postId) {
      throw new Error("Post id is required");
    }

    const post = await this._travelPostRepository.findById(postId);

    if (!post) {
      throw new Error("Travel post not found");
    }

    if (post.status === "APPROVED") {
      return mapTravelPostToDto(post);
    }

    const updated = await this._travelPostRepository.updateStatus(postId, "APPROVED");

    if (!updated) {
      throw new Error("Failed to approve travel post");
    }

    return mapTravelPostToDto(updated);
  }
}
