import { ProfileDto } from "../../../domain/dto/User/ProfileDto";
import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";
import { IUserProfileUsecase } from "../../../domain/interface/UsecaseInterface/IUserProfileUsecase";
export class UserProfileUsecase implements IUserProfileUsecase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(data: {email:string}): Promise<ProfileDto | null> {

    const Userprofile = await this._userRepository.getProfileByEmail(data.email);
    return Userprofile;
  }
}
