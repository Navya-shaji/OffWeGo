import { User } from "../../entities/userEntity";

export interface IUserProfileEditUsecase{
    execute(id:string,updatedData:User):Promise<User |null>
}