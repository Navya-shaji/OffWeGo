
import { RegisterDTO } from "../../dto/user/userDto";

export interface IregisterUserUseCase {
  execute(userData: RegisterDTO): Promise<boolean>;
}
