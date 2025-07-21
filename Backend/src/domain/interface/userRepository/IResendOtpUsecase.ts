export interface IResendOtpUsecase {
  execute(email: string): Promise<void>;
}
