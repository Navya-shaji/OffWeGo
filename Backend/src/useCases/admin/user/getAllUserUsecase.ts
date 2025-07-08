import { UserRepository } from "../../../adapters/repository/user/userRepository";
import { User } from "../../../domain/entities/userEntity";
import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";

export class GetAllUsers{
    private userRepository:IUserRepository

    constructor(userRepository:IUserRepository){
        this.userRepository=userRepository
    }
    async execute():Promise<User[]>{
        return await this.userRepository.getAllUsers()
    }

}