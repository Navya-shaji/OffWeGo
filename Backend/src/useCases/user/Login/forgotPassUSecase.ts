import { IForgotpassUsecase } from "../../../domain/interface/UserLogin/IForgotPassUSecase";
import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";

export class ForgotPassUsecase implements IForgotpassUsecase {
  constructor(private _userRepo: IUserRepository) {}

  async execute(email: string): Promise<void> {
    const user = await this._userRepo.findByEmail(email);
    if (!user) throw new Error("User not found");
  }
}
