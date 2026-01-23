import { IForgotpassUsecase } from "../../../domain/interface/UserLogin/IForgotPassUSecase";
import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";
import { ERROR_MESSAGES } from "../../../constants/messages";
export class ForgotPassUsecase implements IForgotpassUsecase {
  constructor(private _userRepo: IUserRepository) { }

  async execute(email: string): Promise<{ success: boolean; message: string }> {
    const user = await this._userRepo.findByEmail(email);

    if (!user) {
      return { success: false, message: "Email not found. Please check your email address or sign up." };
    }

    if (user.isGoogleUser) {
      return { success: false, message: ERROR_MESSAGES.GOOGLE_ACCOUNT_LINKED };
    }

    return { success: true, message: "OTP sent successfully" };
  }
}