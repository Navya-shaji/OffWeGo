import { UserDto } from "../../dto/User/UserDto";

export interface IGetAllUserUsecase {
  execute(
    page: number,
    limit: number
  ): Promise<{
    users: UserDto[];
    totalUsers: number;
  }>;
}
