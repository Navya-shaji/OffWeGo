import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";
import { IUserLoginUseCase } from "../../../domain/interface/UsecaseInterface/ILoginUserUseCaseInterface";
import { IPasswordService } from "../../../domain/interface/ServiceInterface/IhashpasswordService";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ItokenService";
import { LoginDTo } from "../../../domain/dto/User/LoginDto";
import { LoginResponseDto } from "../../../domain/dto/User/LoginResponseDto";
import { mapToLoginUserDto } from "../../../mappers/User/loginuserMapper";
import { mapNumericRoleToString } from "../../../mappers/User/mapping";

export class UserLoginUseCase implements IUserLoginUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _hashService: IPasswordService,
    private _tokenService: ITokenService
  ) { }

  async execute(data: LoginDTo, fcmToken: string): Promise<LoginResponseDto> {
    const { email, password } = data;

    const user = await this._userRepository.findByEmail(email.toLowerCase().trim());
    if (!user) throw new Error("User Not Found");

    if (user.status?.toLowerCase() === "blocked") {
      throw new Error("Your account has been blocked by the admin");
    }

    if (!user.password) throw new Error("Invalid credentials");
    const isPasswordValid = await this._hashService.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    let savedFcmToken = user.fcmToken || "";
    if (fcmToken) {
      const updatedUser = await this._userRepository.updateFcmToken(
        user._id!.toString(),
        fcmToken
      );
      savedFcmToken = updatedUser?.fcmToken || fcmToken || "";
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: typeof user.role === "number" ? mapNumericRoleToString(user.role) : user.role,
    };

    const accessToken = this._tokenService.generateAccessToken(payload);
    const refreshToken = this._tokenService.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      fcmToken: savedFcmToken,
      user: mapToLoginUserDto(user),
    };
  }

}
