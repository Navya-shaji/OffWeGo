import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../../useCases/user/Signup/signupUserUsecase";
import { RegisterDTO } from "../../../domain/dto/user/userDto";
import { HttpStatus } from "../../../domain/statusCode/statuscode";

export class UserRegisterController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const formData: RegisterDTO = req.body;

     
      if (!formData.email || !formData.password || !formData.name) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email, password and name are required",
        });
        return;
      }

      const otpSent = await this.registerUserUseCase.execute(formData);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "OTP sent to your email address",
        data: {
        email: formData.email,
        username: formData.name, 
      },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Registration failed",
      });
    }
  }
}
