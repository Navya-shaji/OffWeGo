export interface IChangePasswordUseCase {
  execute(params: {
    userId: string;
    oldPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }>;
}
