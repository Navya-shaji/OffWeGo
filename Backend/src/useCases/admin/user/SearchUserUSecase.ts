import { User } from "../../../domain/entities/userEntity";
import { ISearchUserUsecase } from "../../../domain/interface/admin/ISerachUSerUsecase";
import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";

export class SearchUserUSeCase implements ISearchUserUsecase{
    constructor(private userRepo:IUserRepository){}
    async execute(query:string):Promise<User[]>{
        const result=await this.userRepo.searchUser(query)
        return result
    }
}