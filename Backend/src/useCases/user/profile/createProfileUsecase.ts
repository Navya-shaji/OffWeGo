import { Profile } from "../../../domain/dto/user/profileDto";
import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";
import { IUserProfileUsecase } from "../../../domain/interface/usecaseInterface/IUserProfileUsecase";
export class UserProfileUsecase implements IUserProfileUsecase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(data: {email:string}): Promise<Profile | null> {

    const Userprofile = await this._userRepository.getProfileByEmail(data.email);
    return Userprofile;
  }
}
