import { User } from "../../../domain/entities/userEntity";
import { UserModel } from "../../../framework/database/Models/userModel";
import { mapToUser } from "../../../mappers/User/userMapper";

export class EditUserProfile{
    async execute(id:string,updatedData:User):Promise<User |null>{
        const updatedDoc=await UserModel.findByIdAndUpdate(id,updatedData, {new:true})
        return updatedDoc ? mapToUser(updatedDoc):null
    }
}