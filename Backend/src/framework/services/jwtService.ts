import jwt, { JwtPayload } from "jsonwebtoken";
import { ITokenService } from "../../domain/interface/serviceInterface/ItokenService";
const blacklistedTokens: Set<string> = new Set();

export class JwtSevice implements ITokenService {
  generateAccessToken(payload: object): string {
    const secret = process.env.JWT_ACCESSTOKENSECRETKEY;
    if (!secret) {
      throw new Error("Access token secret is not configured");
    }

    return jwt.sign(payload, secret, {
      expiresIn: "15m",
    });
  }

  generateRefreshToken(payload: object): string {
    const secret = process.env.JWT_REFRESHTOKEN;
    if (!secret) {
      throw new Error("Refresh token secret is not configured");
    }

    return jwt.sign(payload, secret, {
      expiresIn: "1d",
    });
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    const secret = process.env.JWT_ACCESSTOKENSECRETKEY;
    if (!secret) {
      throw new Error("Access token secret is not configured");
    }

    return new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err || !decoded) return reject(new Error("Invalid or expired token"));
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