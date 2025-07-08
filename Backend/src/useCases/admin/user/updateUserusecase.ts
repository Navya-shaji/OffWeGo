import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, status: "active" | "block"): Promise<void> {
    if (!["active", "blocked"].includes(status)) {
      throw new Error("Invalid status value");
    }

    await this.userRepository.updateUserStatus(userId, status);
  }
}
