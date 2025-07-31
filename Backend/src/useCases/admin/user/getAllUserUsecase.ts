import { User } from "../../../domain/entities/userEntity";
import { IGetAllUser } from "../../../domain/interface/admin/IGetAllUsers";
import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";
export class GetAllUsers implements IGetAllUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<{ users: User[]; totalUsers: number }> {
    return await this.userRepository.getAllUsers(); // no pagination
  }
}
