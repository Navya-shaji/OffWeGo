import { UserDto } from "../../dto/user/UserDto";

export interface IGetAllUserUsecase {
  execute(
    page: number,
    limit: number
  ): Promise<{
    users: UserDto[];
    totalUsers: number;
  }>;
}
