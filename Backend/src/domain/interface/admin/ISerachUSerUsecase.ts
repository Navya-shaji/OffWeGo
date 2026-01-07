import { UserDto } from "../../dto/User/userDto";

export interface ISearchUserUsecase {
  execute(query: string): Promise<UserDto[]>;
}
