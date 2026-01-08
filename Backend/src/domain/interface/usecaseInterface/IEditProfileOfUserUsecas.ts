import { User } from "../../entities/UserEntity";

export interface IUserProfileEditUsecase {
  execute(id: string, updatedData: User): Promise<User | null>;
}
