
export interface IResetPasswordUseCase {
  execute(email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }>;
}
