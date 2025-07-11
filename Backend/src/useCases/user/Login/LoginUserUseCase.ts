import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";
import { IUserLoginUseCase } from "../../../domain/interface/usecaseInterface/ILoginUserUseCaseInterface";
import { IPasswordService } from "../../../domain/interface/serviceInterface/IhashpasswordService";
import { ITokenService } from "../../../domain/interface/serviceInterface/ItokenService";
import { LoginDTo } from "../../../domain/dto/user/LoginDto";

export class UserLoginUseCase implements IUserLoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IPasswordService,
    private tokenService: ITokenService
  ) {}

  async execute(data: LoginDTo): Promise<{
    token: string;
    user: { id: string; email: string; username: string; status: string };
  }> {
    const { email, password } = data;

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User Not Found");

    if (
      user.status?.toLowerCase() === "blocked" ||
      user.status?.toLowerCase() === "block"
    ) {
      throw new Error("Your account has been blocked by the admin");
    }

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password
    );
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = this.tokenService.generateToken({
      id: user._id,
      email: user.email,
    });
    console.log("User Status:", user.status);

    return {
      token,
      user: {
        id: user._id?.toString() ?? "",
        email: user.email,
        username: user.name,
        status: user.status ?? "active",
      },
    };
  }
}
