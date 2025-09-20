import jwt, { JwtPayload } from "jsonwebtoken";
import { ITokenService } from "../../domain/interface/ServiceInterface/ItokenService";

const blacklistedTokens: Set<string> = new Set();

export class JwtService implements ITokenService {
  generateAccessToken(payload: object): string {
    console.log("access token");
    const secret = process.env.JWT_ACCESSTOKENSECRETKEY;
    if (!secret) throw new Error("Access token secret is not configured");

    return jwt.sign(payload, secret, { expiresIn: "15m" });
  }

  generateRefreshToken(payload: object): string {
    console.log("refresh");
    const secret = process.env.JWT_REFRESHTOKEN;
    if (!secret) throw new Error("Refresh token secret is not configured");

    return jwt.sign(payload, secret, { expiresIn: "1d" });
  }

  async verifyToken(
    token: string,
    type: "access" | "refresh" = "access"
  ): Promise<JwtPayload | null> {
    try {
      const secret =
        type === "access"
          ? process.env.JWT_ACCESSTOKENSECRETKEY
          : process.env.JWT_REFRESHTOKEN;

      if (!secret) throw new Error(`${type} token secret is not configured`);

      if (this.checkTokenBlacklist(token)) {
        throw new Error("Token is blacklisted");
      }
      console.log(`🔍 Verifying ${type} token...`);
      return await new Promise<JwtPayload>((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
          if (err || !decoded) return reject(err);
          resolve(decoded as JwtPayload);
        });
      });
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }

  checkTokenBlacklist(token: string): boolean {
    return blacklistedTokens.has(token);
  }

  blacklistToken(token: string): void {
    blacklistedTokens.add(token);
  }
}
