export interface IVerifyOtpVendorUsecase{
    execute(email: string, otp: string): Promise<string>
}