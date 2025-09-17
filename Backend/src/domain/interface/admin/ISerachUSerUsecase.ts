import { User } from "../../entities/UserEntity";

export interface  ISearchUserUsecase{
    execute(query:string):Promise<User[]>
}