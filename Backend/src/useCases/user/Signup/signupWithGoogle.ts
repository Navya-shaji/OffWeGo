import { AuthRepository } from "../../../adapters/repository/User/AuthRepository";
import { User } from "../../../domain/entities/userEntity";
import { IGoogleSignupUseCase } from "../../../domain/interface/UsecaseInterface/IgoogleSignupUsecase";
import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";
import { mapToGoogleUser } from "../../../mappers/User/googleMappping";
export class GoogleSignupUseCase implements IGoogleSignupUseCase {
  constructor(
    private _authRepository: AuthRepository,
    private _userRepository: IUserRepository
  ) { }

  async execute(googleToken: string, fcmToken: string): Promise<User> {
    const googleUser = await this._authRepository.signupWithGoogle(googleToken);


    if (fcmToken) {
      await this._userRepository.updateFcmToken(
        googleUser._id!.toString(),
        fcmToken
      );
      googleUser.fcmToken = fcmToken;
    }

    return mapToGoogleUser(googleUser);
  }
}
