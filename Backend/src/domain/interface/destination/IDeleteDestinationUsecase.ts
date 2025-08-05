export interface IDeleteDestinationUseCase {
  execute(id: string): Promise<{ success: boolean; message: string }>;
}
