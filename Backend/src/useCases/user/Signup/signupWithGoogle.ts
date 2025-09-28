import { AuthRepository } from "../../../adapters/repository/User/AuthRepository";
import { User } from "../../../domain/entities/UserEntity";
import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";
import { mapToUser } from "../../../mappers/User/userMapper";

export class GoogleSignupUseCase{
    constructor(
        private _authRepository:AuthRepository,
        private _userRepository:IUserRepository
    ){}

    async execute(googleToken:string):Promise<User>{
        const googleUser=await this._authRepository.signupWithGoogle(googleToken)
        const user=mapToUser(googleUser)
        console.log(user)
        const existingUser=await this._userRepository.findByEmail(googleUser.email)
        if(existingUser) return mapToUser(existingUser)

        const newUser:User={
            name:googleUser.name,
            email:googleUser.email,
            phone:googleUser.phone,
            password:"",
            role:"user"
        }

        const savedUser=await this._userRepository.createUser(newUser)
        return mapToUser(savedUser)
    }
}

