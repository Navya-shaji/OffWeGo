export interface IDeletePackagenUseCase {
  execute(id: string): Promise<{ success: boolean; message: string }>;
}