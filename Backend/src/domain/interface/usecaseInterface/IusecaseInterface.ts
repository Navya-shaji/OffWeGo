import { UserDto } from "../../dto/user/UserDto";

export interface IregisterUserUseCase {
  execute(userData: UserDto): Promise<boolean>;
}
