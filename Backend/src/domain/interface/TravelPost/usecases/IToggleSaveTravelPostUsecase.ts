export interface IToggleSaveTravelPostUsecase {
  execute(userId: string, postId: string): Promise<{ saved: boolean; likes: number }>;
}
