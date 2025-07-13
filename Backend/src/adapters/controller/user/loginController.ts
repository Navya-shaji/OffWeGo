import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { UserLoginUseCase } from "../../../useCases/user/Login/LoginUserUseCase";

export class UserLoginController {
  constructor(private loginUserUseCase: UserLoginUseCase) {}

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and password are required",
        });
        return;
      }

      const { token, user } = await this.loginUserUseCase.execute({ email, password });

      // ✅ Check if role is admin
      if (user.role?.toLowerCase() === "admin") {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: "Admins are not allowed to log in from user portal",
        });
        return;
      }

      // ✅ Check if account is blocked
      if (user.status?.toLowerCase().includes("block")) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: "Your account has been blocked by the admin",
        });
        return;
      }

      // ✅ Allow user login
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Login successful",
        token,
        user,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error?.message || "Login failed",
      });
    }
  }
}
