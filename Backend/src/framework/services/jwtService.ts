import jwt, { JwtPayload } from "jsonwebtoken";
import { ITokenService } from "../../domain/interface/serviceInterface/ItokenService";


const blacklistedTokens: Set<string> = new Set();
export class JwtSevice implements ITokenService {
    generateAccessToken(payload: object): string {
        if(!process.env.JWT_ACCESSTOKENSECRETKEY){
             throw new Error("Jwt secret is not configured")
        }
        return jwt.sign(payload, process.env.JWT_ACCESSTOKENSECRETKEY as string, { expiresIn: "15m" })
    }
    generateRefreshToken(payload:object):string{
        if(!process.env.JWT_REFRESHTOKEN){
            throw new Error("Refresh token is not configured")
        }
        return jwt.sign(payload, process.env.JWT_REFRESHTOKEN as string, { expiresIn: "1d" })
    }
    async verifyToken(token: string): Promise<string | JwtPayload> {
    const secret = process.env.JWT_ACCESSTOKENSECRETKEY;
    if (!secret) {
      throw new Error("Access token secret is not configured");
    }

    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded as JwtPayload);
      });
    });
  }

  async checkTokenBlacklist(token: string): Promise<boolean> {
    return blacklistedTokens.has(token);
  }

  async blacklistToken(token: string): Promise<void> {
    blacklistedTokens.add(token);
  }
}

