import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../../useCases/user/Signup/signupUserUsecase";
import { RegisterDTO } from "../../../domain/dto/user/userDto";
import { HttpStatus } from "../../../domain/statusCode/statuscode";

export class UserRegisterController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const formData: RegisterDTO = req.body;
      console.log(formData)
      const createdUser = await this.registerUserUseCase.execute(formData);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "User registered successfully",
        data: createdUser,
      });
    } catch (error) {
      console.log(error)
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message:"Registration failed",
      });
    }
  }
}
