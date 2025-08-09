import { User } from "../../entities/userEntity";

export interface  ISearchUserUsecase{
    execute(query:string):Promise<User[]>
}