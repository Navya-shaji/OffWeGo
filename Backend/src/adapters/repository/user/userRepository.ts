import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";
import { User } from "../../../domain/entities/userEntity";
import { UserModel } from "../../../framework/database/Models/userModel";

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
}
