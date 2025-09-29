export interface IDeleteBannerUsecase {
  execute(id: string): Promise<{ success: boolean; message: string }>;
}
