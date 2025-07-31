import { User } from "../../entities/userEntity";

export interface IGetAllUser{
    execute(): Promise<{
    users: User[];
    totalUsers: number;
  }>;
}