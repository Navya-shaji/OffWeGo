import { AuthRepository } from "../../../adapters/repository/User/AuthRepository";
import { Role } from "../../../domain/constants/Roles";
import { User } from "../../../domain/entities/userEntity";
import { IGoogleSignupUseCase } from "../../../domain/interface/UsecaseInterface/IgoogleSignupUsecase";
import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";
import { mapToGoogleUser } from "../../../mappers/User/googleMappping";
export class GoogleSignupUseCase implements IGoogleSignupUseCase {
  constructor(
    private _authRepository: AuthRepository,
    private _userRepository: IUserRepository
  ) {}

  async execute(googleToken: string, fcmToken: string): Promise<User> {
    const googleUser = await this._authRepository.signupWithGoogle(googleToken);

    const existingUser = await this._userRepository.findByEmail(
      googleUser.email
    );
console.log(existingUser,"ex")
    if (existingUser) {
      if (fcmToken) {
        await this._userRepository.updateFcmToken(
          existingUser._id!.toString(),
          fcmToken
        );
        existingUser.fcmToken = fcmToken;
      }

      return mapToGoogleUser(existingUser);
    } 

    const newUser: User = {
      _id: googleUser._id,
      name: googleUser.name,
      email: googleUser.email,
      phone: googleUser.phone,
      password: "",
      role: Role.USER,
      fcmToken: fcmToken || "",
    };
console.log(newUser,"newUser")
    const savedUser = await this._userRepository.createUser(newUser);
    return mapToGoogleUser(savedUser);
  }
}
