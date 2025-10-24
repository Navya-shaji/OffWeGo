import { ChangePasswordDTO } from "../../../domain/interface/UserRepository/IPasswordChangeUsecase";
import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository"; 
import bcrypt from "bcrypt";

export class ChangePasswordUseCase {
  constructor(private _userRepo: IUserRepository) {}

  async execute({ userId, oldPassword, newPassword }: ChangePasswordDTO) {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Current password is incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this._userRepo.updatePasswordById(userId, hashedPassword);

    return { success: true, message: "Password changed successfully" };
  }
}
