import { IAdminRepository } from "../../../domain/interface/admin/IAdminRepository";
import { User } from "../../../domain/entities/userEntity";
import { UserModel } from "../../../framework/database/Models/userModel";

export class AdminRepository implements IAdminRepository {
    async findByEmail(email: string): Promise<User | null> {
        return await UserModel.findOne({email})
    }
}