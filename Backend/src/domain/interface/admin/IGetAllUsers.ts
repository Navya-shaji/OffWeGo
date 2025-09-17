import { User } from "../../entities/UserEntity";

export interface IGetAllUser {
  execute(
    page: number,
    limit: number
  ): Promise<{
    users: User[];
    totalUsers: number;
  }>;
}
