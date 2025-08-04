import { AuthRepository } from "../../../adapters/repository/user/authRepository";
import { User } from "../../../domain/entities/userEntity";
import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";
import { mapToUser } from "../../../mappers/User/userMapper";

export class GoogleSignupUseCase{
    constructor(
        private authRepository:AuthRepository,
        private userRepository:IUserRepository
    ){}

    async execute(googleToken:string):Promise<User>{
        const googleUser=await this.authRepository.signupWithGoogle(googleToken)
        const user=mapToUser(googleUser)
        const existingUser=await this.userRepository.findByEmail(googleUser.email)
        if(existingUser) return mapToUser(existingUser)

        const newUser:User={
            name:googleUser.name,
            email:googleUser.email,
            phone:googleUser.phone,
            password:"",
            role:"user"
        }

        const savedUser=await this.userRepository.createUser(newUser)
        return mapToUser(savedUser)
    }
}

