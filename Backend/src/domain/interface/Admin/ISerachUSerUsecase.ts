import { UserDto } from "../../dto/User/UserDto";

export interface ISearchUserUsecase {
  execute(query: string): Promise<UserDto[]>;
}
