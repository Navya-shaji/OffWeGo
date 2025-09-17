
import { RegisterDTO } from "../../dto/user/UserDto";

export interface IregisterUserUseCase {
  execute(userData: RegisterDTO): Promise<boolean>;
}
