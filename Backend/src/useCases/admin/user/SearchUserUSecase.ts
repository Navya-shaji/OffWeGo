import { UserDto } from "../../../domain/dto/user/UserDto";
import { ISearchUserUsecase } from "../../../domain/interface/Admin/ISerachUSerUsecase";
import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";
import { mapToUser } from "../../../mappers/User/userMapper";

export class SearchUserUseCase implements ISearchUserUsecase {
  constructor(private _userRepo: IUserRepository) {}

  async execute(query: string): Promise<UserDto[]> {
    const result = await this._userRepo.searchUser(query);
    return result.map(mapToUser);
  }
}
