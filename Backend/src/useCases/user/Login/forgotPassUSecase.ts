import { IForgotpassUsecase } from "../../../domain/interface/UserLogin/IForgotPassUSecase";
import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";
export class ForgotPassUsecase implements IForgotpassUsecase {
  constructor(private _userRepo: IUserRepository) {}

  async execute(email: string): Promise<{ message: string }> {
    const user = await this._userRepo.findByEmail(email);

    if (!user) {
      return { message: "If the email exists, an OTP has been sent" };
    }
    return { message: "OTP sent successfully" };
  }
}