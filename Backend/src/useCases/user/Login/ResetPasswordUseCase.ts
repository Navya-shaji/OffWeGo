import { IResetPasswordUseCase } from "../../../domain/interface/usecaseInterface/IResetPasswordUseCase";
import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";
import { IPasswordService } from "../../../domain/interface/serviceInterface/IhashpasswordService";


export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService
  ) {}
  async execute(
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new Error("User not found");

    const hashPassword = await this.passwordService.hashPassword(newPassword);
    await this.userRepository.updatePassword(email, hashPassword);
    return { success: true, message: "Password Reset successfully" };
  }
}
