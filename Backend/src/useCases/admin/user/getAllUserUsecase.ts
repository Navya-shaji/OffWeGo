import { Role } from "../../../domain/constants/Roles";
import { UserDto } from "../../../domain/dto/User/UserDto";
import { IGetAllUserUsecase } from "../../../domain/interface/Admin/IGetAllUsers";
import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";

export class GetAllUsersUsecase implements IGetAllUserUsecase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(
    page: number,
    limit: number
  ): Promise<{ users: UserDto[]; totalUsers: number }> {
    const skip = (page - 1) * limit;

    const users = await this._userRepository.getAllUsers(skip, limit, {
      role: Role.USER,
    });
    const totalUsers = await this._userRepository.countUsers({ role: Role.USER });

    return { users, totalUsers };
  }
}
