import { User } from "../../entities/UserEntity";

export interface IGetAllUserUsecase {
  execute(
    page: number,
    limit: number
  ): Promise<{
    users: User[];
    totalUsers: number;
  }>;
}
