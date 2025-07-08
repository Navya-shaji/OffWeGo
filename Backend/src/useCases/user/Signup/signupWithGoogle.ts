import { AuthRepository } from "../../../adapters/repository/user/authRepository";
import { User } from "../../../domain/entities/userEntity";
import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";

export class GoogleSignupUseCase{
    constructor(
        private authRepository:AuthRepository,
        private userRepository:IUserRepository
    ){}

    async execute(googleToken:string):Promise<User>{
        const googleUser=await this.authRepository.signupWithGoogle(googleToken)
        const existingUser=await this.userRepository.findByEmail(googleUser.email)
        if(existingUser) return existingUser

        const newUser:User={
            name:googleUser.name,
            email:googleUser.email,
            phone:googleUser.phone,
            password:"",
            role:"user"
        }

        const savedUser=await this.userRepository.createUser(newUser)
        return savedUser
    }
}

