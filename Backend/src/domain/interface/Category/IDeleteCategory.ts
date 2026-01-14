export interface IDeleteCategorynUseCase {
  execute(id: string): Promise<{ success: boolean; message: string }>;
}
