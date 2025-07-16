import { User } from "../../entities/userEntity";

export interface IGetAllUser{
    execute(params: { skip: number; limit: number }): Promise<{
    users: User[];
    totalUsers: number;
  }>;
}