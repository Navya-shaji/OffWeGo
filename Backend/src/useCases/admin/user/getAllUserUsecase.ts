import { User } from "../../../domain/entities/userEntity";
import { IGetAllUser } from "../../../domain/interface/admin/IGetAllUsers";
import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";

export class GetAllUsers implements IGetAllUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(page: number, limit: number): Promise<{ users: User[]; totalUsers: number }> {
    const skip = (page - 1) * limit;

    
    const users = await this.userRepository.getAllUsers(skip, limit, { role: "user" });

    
    const totalUsers = await this.userRepository.countUsers({ role: "user" });

    return { users, totalUsers };
  }
}
