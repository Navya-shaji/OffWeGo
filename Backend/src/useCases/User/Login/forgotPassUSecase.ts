import { IForgotpassUsecase } from "../../../domain/interface/UserLogin/IForgotPassUSecase";
import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";
export class ForgotPassUsecase implements IForgotpassUsecase {
  constructor(private _userRepo: IUserRepository) { }

  async execute(email: string): Promise<{ success: boolean; message: string }> {
    const user = await this._userRepo.findByEmail(email);

    if (!user) {
      return { success: false, message: "Email not found. Please check your email address or sign up." };
    }

    if (user.isGoogleUser) {
      return { success: false, message: "This account is linked with Google. Please use Google Sign-In to access your account." };
    }

    return { success: true, message: "OTP sent successfully" };
  }
}