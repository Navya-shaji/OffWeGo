import { User } from "../../../domain/entities/UserEntity"
import { ISearchUserUsecase } from "../../../domain/interface/Admin/ISerachUSerUsecase"
import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository"

export class SearchUserUSeCase implements ISearchUserUsecase{
    constructor(private _userRepo:IUserRepository){}
    async execute(query:string):Promise<User[]>{
        const result=await this._userRepo.searchUser(query)
        return result
    }
}