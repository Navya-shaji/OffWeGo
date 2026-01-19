import { IToggleSaveTravelPostUsecase } from "../../domain/interface/TravelPost/usecases/IToggleSaveTravelPostUsecase";
import { IUserRepository } from "../../domain/interface/UserRepository/IuserRepository";
import { ITravelPostRepository } from "../../domain/interface/TravelPost/ITravelPostRepository";

export class ToggleSaveTravelPostUsecase implements IToggleSaveTravelPostUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly travelPostRepository: ITravelPostRepository
  ) { }

  async execute(
    userId: string,
    postId: string
  ): Promise<{ saved: boolean; likes: number }> {
    if (!userId) {
      throw new Error("User id is required");
    }
    if (!postId) {
      throw new Error("Post id is required");
    }

    const post = await this.travelPostRepository.findById(postId);

    if (!post) {
      throw new Error("Travel post not found");
    }

    // If it's not approved, only the author should be able to save it
    if (post.status !== "APPROVED" && post.authorId !== userId) {
      throw new Error("Only approved travel posts can be saved");
    }

    const saved = await this.userRepository.toggleSaveTravelPost(userId, postId);

    const delta = saved ? 1 : -1;
    const nextLikes = await this.travelPostRepository.adjustLikes(postId, delta);

    return { saved, likes: nextLikes };
  }
}
