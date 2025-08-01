import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";
import { User } from "../../../domain/entities/userEntity";
import { UserModel } from "../../../framework/database/Models/userModel";
import { Profile } from "../../../domain/dto/user/profileDto";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }
  async createUser(user: User): Promise<User> {
    return await UserModel.create(user);
  }
  async findByPhone(phone: string): Promise<User | null> {
    return await UserModel.findOne({ phone });
  }
  async updatePassword(
    email: string,
    newHashedPassword: string
  ): Promise<void> {
    await UserModel.updateOne(
      { email },
      { $set: { password: newHashedPassword } }
    );
  }
async getAllUsers(): Promise<{ users: User[], totalUsers: number }> {
  const users = await UserModel.find()
  const totalUsers = await UserModel.countDocuments();

  return { users, totalUsers };
}

   async updateUserStatus(userId: string, status: "active" | "block"): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.status = status;
    await user.save();
  }
    async countUsers(): Promise<number> {
    return await UserModel.countDocuments();
  }
  async getProfileByEmail(email:string): Promise<Profile | null>{
    return await UserModel.findOne({email})
  }
}
