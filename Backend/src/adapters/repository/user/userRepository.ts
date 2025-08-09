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
  async getAllUsers(
    skip: number,
    limit: number,
    filter: Record<string, any> = {}
  ): Promise<User[]> {
    return await UserModel.find(filter).skip(skip).limit(limit);
  }

  async updateUserStatus(
    userId: string,
    status: "active" | "block"
  ): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.status = status;
    await user.save();
  }
  async countUsers(filter: Record<string, any> = {}): Promise<number> {
    return await UserModel.countDocuments(filter);
  }
  async getProfileByEmail(email: string): Promise<Profile | null> {
    return await UserModel.findOne({ email });
  }
  async searchUser(query:string):Promise<User[]>{
    const regex=new RegExp(query,"i")
    return UserModel.find({name:{$regex:regex},status:'active'}).select('name email ').limit(10).exec()

  }
}
