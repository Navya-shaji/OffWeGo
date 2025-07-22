import { JwtPayload } from "jsonwebtoken";

export interface ITokenService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  verifyToken(token: string): Promise<string | JwtPayload>;
  checkTokenBlacklist(token: string): Promise<boolean>;
}
