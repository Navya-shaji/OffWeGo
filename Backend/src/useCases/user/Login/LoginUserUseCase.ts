import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";
import { IUserLoginUseCase } from "../../../domain/interface/usecaseInterface/ILoginUserUseCaseInterface";
import { IPasswordService } from "../../../domain/interface/serviceInterface/IhashpasswordService";
import { ITokenService } from "../../../domain/interface/serviceInterface/ItokenService";
import { LoginDTo } from "../../../domain/dto/user/LoginDto";
import { mapNumericRoleToString } from "../../../mappers/User/mapping"; 

export class UserLoginUseCase implements IUserLoginUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _hashService: IPasswordService,
    private _tokenService: ITokenService
  ) {}

  async execute(data: LoginDTo): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; username: string; status: string; role: 'user' | 'vendor' | 'admin' ;phone:string;imageUrl:string};
  }> {
    const { email, password } = data;

    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new Error("User Not Found");

    if (
      user.status?.toLowerCase() === "blocked" ||
      user.status?.toLowerCase() === "block"
    ) {
      throw new Error("Your account has been blocked by the admin");
    }

    const isPasswordValid = await this._hashService.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const role = typeof user.role === 'number' ? mapNumericRoleToString(user.role) : user.role;

    const payload = {
      id: user._id,
      email: user.email,
      role,
    };

    const accessToken = this._tokenService.generateAccessToken(payload);
    const refreshToken = this._tokenService.generateRefreshToken(payload);


    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id?.toString() ?? "",
        email: user.email,
        username: user.name,
        status: user.status ?? "active",
        role,
        phone:user.phone.toString(),
        imageUrl:user.imageUrl ?? ""
      },
    };
  }
}
