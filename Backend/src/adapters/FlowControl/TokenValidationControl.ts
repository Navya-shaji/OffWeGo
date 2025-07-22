import { NextFunction, Request, Response } from "express";
import { ITokenService } from "../../domain/interface/serviceInterface/ItokenService";
import { HttpStatus } from "../../domain/statusCode/statuscode";

// Define a type for user payload if you know the structure, else use `unknown`
declare module "express-serve-static-core" {
  interface Request {
    user?: unknown; // Replace `unknown` with the actual decoded token type if known
  }
}

export const verifyTokenAndCheckBlackList = (tokenService: ITokenService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
      console.log("Middleware reached: verifyTokenAndCheckBlackList");

      req.user = decoded; // Attach to request
      next(); // ✅ Must call next to proceed
    } catch (error) {
      res.status(HttpStatus.FORBIDDEN).json({
        message: "Invalid token.",
        error: error instanceof Error ? error.message : "Invalid token",
      });
    }
  };
};
