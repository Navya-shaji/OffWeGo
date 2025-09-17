import { ITokenService } from "../../domain/interface/ServiceInterface/ItokenService";

export class RefreshTokenUseCase {
  private _tokenService: ITokenService;

  constructor(tokenService: ITokenService) {
    this._tokenService = tokenService;
  }

  async execute(refreshToken: string) {
    const isBlacklisted = await this._tokenService.checkTokenBlacklist(refreshToken);
    if (isBlacklisted) {
      throw new Error("Refresh token is blacklisted or invalid");
    }

    const decoded = await this._tokenService.verifyToken(refreshToken , 'refresh');
   
    if (!decoded) {
      throw new Error("Invalid or expired refresh token");
    }
    const payload = { userId: (decoded as any).userId, role: (decoded as any).role };
    const newAccessToken = this._tokenService.generateAccessToken(payload);
    const newRefreshToken = this._tokenService.generateRefreshToken(payload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
