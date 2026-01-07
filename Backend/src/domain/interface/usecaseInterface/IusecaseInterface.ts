import { UserDto } from "../../dto/User/userDto";

export interface IregisterUserUseCase {
  execute(userData: UserDto): Promise<boolean>;
}
