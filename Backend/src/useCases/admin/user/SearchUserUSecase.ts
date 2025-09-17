import { User } from "../../../domain/entities/userEntity";
import { ISearchUserUsecase } from "../../../domain/interface/admin/ISerachUSerUsecase";
import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";

export class SearchUserUSeCase implements ISearchUserUsecase{
    constructor(private _userRepo:IUserRepository){}
    async execute(query:string):Promise<User[]>{
        const result=await this._userRepo.searchUser(query)
        return result
    }
}