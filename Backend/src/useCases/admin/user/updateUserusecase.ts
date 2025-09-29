import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";

export class UpdateUserUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(userId: string, status: "active" | "block"): Promise<void> {
    if (!["active", "blocked"].includes(status)) {
      throw new Error("Invalid status value");
    }

    await this._userRepository.updateUserStatus(userId, status);
  }
}
