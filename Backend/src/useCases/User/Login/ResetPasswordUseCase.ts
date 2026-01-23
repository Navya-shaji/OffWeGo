import { IResetPasswordUseCase } from "../../../domain/interface/UsecaseInterface/IResetPasswordUseCase";
import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";
import { IPasswordService } from "../../../domain/interface/ServiceInterface/IhashpasswordService";


export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _passwordService: IPasswordService
  ) { }
  async execute(
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) throw new Error("User not found");

    if (user.isGoogleUser) {
      throw new Error("This account is linked with Google. Password reset is not allowed.");
    }

    const hashPassword = await this._passwordService.hashPassword(newPassword);
    await this._userRepository.updatePassword(email, hashPassword);
    return { success: true, message: "Password Reset successfully" };
  }
}
