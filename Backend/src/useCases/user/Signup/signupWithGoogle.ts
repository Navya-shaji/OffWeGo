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

  async execute(googleToken: string): Promise<User> {
    const googleUser = await this._authRepository.signupWithGoogle(googleToken);
    console.log(googleUser,"google")
    const user = mapToGoogleUser(googleUser);
    const existingUser = await this._userRepository.findByEmail(
      googleUser.email
    );
    if (existingUser) return mapToGoogleUser(existingUser);
console.log(existingUser,"exist")
    const newUser: User = {
      _id: googleUser._id,
      name: googleUser.name,
      email: googleUser.email,
      phone: googleUser.phone,
      password: "",
      role: Role.USER,
      fcmToken: googleUser.fcmToken,
    };
console.log(newUser,"jskd")
    const savedUser = await this._userRepository.createUser(newUser);
    return mapToGoogleUser(savedUser);
  }
}
