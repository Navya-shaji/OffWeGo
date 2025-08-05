import { User } from "../../entities/userEntity";

export interface IGetAllUser {
  execute(
    page: number,
    limit: number
  ): Promise<{
    users: User[];
    totalUsers: number;
  }>;
}
