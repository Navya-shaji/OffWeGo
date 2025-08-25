import { User } from "../../../domain/entities/userEntity";
import { IGetAllUser } from "../../../domain/interface/admin/IGetAllUsers";
import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";

export class GetAllUsers implements IGetAllUser {
  constructor(private _userRepository: IUserRepository) {}

  async execute(
    page: number,
    limit: number
  ): Promise<{ users: User[]; totalUsers: number }> {
    const skip = (page - 1) * limit;

    const users = await this._userRepository.getAllUsers(skip, limit, {
      role: "user",
    });
    const totalUsers = await this._userRepository.countUsers({ role: "user" });

    return { users, totalUsers };
  }
}
