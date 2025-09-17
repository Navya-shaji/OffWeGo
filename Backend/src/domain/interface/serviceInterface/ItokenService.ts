import { JwtPayload } from "jsonwebtoken";

export interface ITokenService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  verifyToken(token: string, type?:string): Promise<JwtPayload | null>;
  checkTokenBlacklist(token: string): boolean; 
}
