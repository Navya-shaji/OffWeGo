import bcrypt from "bcrypt";

export class HashPassword{
    async hashPassword(password:string):Promise<string>{
        return await bcrypt.hash(password,10)
    }
}

