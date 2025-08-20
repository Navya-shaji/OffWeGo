import { ITokenService } from "../../domain/interface/serviceInterface/ItokenService";

export class RefreshTokenUseCase {
  private tokenService: ITokenService;

  constructor(tokenService: ITokenService) {
    this.tokenService = tokenService;
  }

  async execute(refreshToken: string) {
    const isBlacklisted = await this.tokenService.checkTokenBlacklist(refreshToken);
    if (isBlacklisted) {
      throw new Error("Refresh token is blacklisted or invalid");
    }

    const decoded = await this.tokenService.verifyToken(refreshToken , 'refresh');
   
    if (!decoded) {
      throw new Error("Invalid or expired refresh token");
    }
    const payload = { userId: (decoded as any).userId, role: (decoded as any).role };
    const newAccessToken = this.tokenService.generateAccessToken(payload);
    const newRefreshToken = this.tokenService.generateRefreshToken(payload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
