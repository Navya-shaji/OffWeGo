import { RegisterDTO } from "../../dto/user/userDto";

export interface IUserLoginUseCase{
	execute(date: RegisterDTO): Promise<{ token: string; user: { id: string; email: string } }>;
}