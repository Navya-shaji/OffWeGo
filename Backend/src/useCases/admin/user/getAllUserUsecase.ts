
import { User } from "../../../domain/entities/userEntity";
import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";

export class GetAllUsers {
  constructor(private userRepository: IUserRepository) {}

  async execute({ skip, limit }: { skip: number; limit: number }): Promise<{
    users: User[];
    totalUsers: number;
  }> {
    return await this.userRepository.getAllUsers(skip, limit);
  }
}
