import { UserDto } from "../../dto/User/userDto";

export interface IGetAllUserUsecase {
  execute(
    page: number,
    limit: number
  ): Promise<{
    users: UserDto[];
    totalUsers: number;
  }>;
}
