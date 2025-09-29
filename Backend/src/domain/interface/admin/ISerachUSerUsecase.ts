import { UserDto } from "../../dto/user/UserDto";

export interface ISearchUserUsecase {
  execute(query: string): Promise<UserDto[]>;
}
