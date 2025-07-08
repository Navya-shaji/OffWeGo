import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { GoogleSignupUseCase } from "../../../useCases/user/Signup/signupWithGoogle";


export class GoogleSignupController{
    private GoogleSignupUseCase: GoogleSignupUseCase;

    constructor(googleSignupUseCase: GoogleSignupUseCase) {
        this.GoogleSignupUseCase = googleSignupUseCase;
    }

    async googleSignup(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.body;
            
            if (!token) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "Google Token is Required" });
                return;
            }
            const user = await this.GoogleSignupUseCase.execute(token);
            res.status(HttpStatus.OK).json({message:"Signup Successfully",user})
        } catch (error) {
             console.error("Google signup failed:", error); 
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Google signup failed" })

        }
    }
}