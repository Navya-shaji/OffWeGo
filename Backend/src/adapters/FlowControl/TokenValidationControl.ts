import { NextFunction, Request, Response } from "express";
import { ITokenService } from "../../domain/interface/serviceInterface/ItokenService";
import { HttpStatus } from "../../domain/statusCode/statuscode";

declare module "express-serve-static-core" {
  interface Request {
    user?: unknown;
  }
}

export const verifyTokenAndCheckBlackList = (tokenService: ITokenService) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Access denied. No token provided." });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const isBlacklisted = await tokenService.checkTokenBlacklist(token);
      if (isBlacklisted) {
        res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "This token is blacklisted" });
        return;
      }

      const decoded = await tokenService.verifyToken(token);
      if (!decoded || !decoded.exp) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ error: "Token expiration done" });
        return;
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(HttpStatus.FORBIDDEN).json({
        message: "Invalid token.",
        error: error instanceof Error ? error.message : "Invalid token",
      });
    }
  };
};
