export interface IResetPasswordUseCase {
  execute(
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }>;
}
