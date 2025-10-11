import { UserDto } from "../../dto/User/UserDto";

export interface IregisterUserUseCase {
  execute(userData: UserDto): Promise<boolean>;
}
