import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";
import {IUserModel,UserModel} from "../../../framework/database/Models/userModel";
import { ProfileDto } from "../../../domain/dto/user/ProfileDto";
import { BaseRepository } from "../BaseRepo/BaseRepo";

export class UserRepository
  extends BaseRepository<IUserModel>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUserModel | null> {
    return this.model.findOne({ email });
  }

  async createUser(user: IUserModel): Promise<IUserModel> {
    return this.create(user);
  }

  async findByPhone(phone: string): Promise<IUserModel | null> {
    return this.model.findOne({ phone });
  }

  async updatePassword(
    email: string,
    newHashedPassword: string
  ): Promise<void> {
    await this.model.updateOne(
      { email },
      { $set: { password: newHashedPassword } }
    );
  }

  async getAllUsers(
    skip: number,
    limit: number,
    filter: Record<string, unknown> = {}
  ): Promise<IUserModel[]> {
    return this.model.find(filter).skip(skip).limit(limit);
  }

  async updateUserStatus(
    userId: string,
    status: "active" | "block"
  ): Promise<void> {
    const user = await this.findById(userId);
    if (!user) throw new Error("User not found");

    user.status = status;
    await user.save();
  }

  async countUsers(filter: Record<string, unknown> = {}): Promise<number> {
    return this.model.countDocuments(filter);
  }

  async getProfileByEmail(email: string): Promise<ProfileDto | null> {
    return this.model.findOne({ email });
  }

  async searchUser(query: string): Promise<IUserModel[]> {
    const regex = new RegExp(query, "i");
    return this.model
      .find({ name: { $regex: regex } })
      .select("name email phone createdAt ")
      .limit(10)
      .exec();
  }
}
