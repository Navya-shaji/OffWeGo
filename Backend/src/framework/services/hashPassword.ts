import bcrypt from "bcrypt";
import { IPasswordService } from "../../domain/interface/ServiceInterface/IhashpasswordService";

export class HashPassword implements IPasswordService{
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password,10)
    }
    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password,hashedPassword)
    }
}

