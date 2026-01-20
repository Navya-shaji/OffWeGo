/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProfileDto } from "../../../domain/dto/User/profileDto";
import { IUserRepository } from "../../../domain/interface/UserRepository/IuserRepository";
import {
  IUserModel,
  UserModel,
} from "../../../framework/database/Models/userModel";
import { BaseRepository } from "../BaseRepo/BaseRepo";
import { Types } from "mongoose";

export class UserRepository
  extends BaseRepository<IUserModel>
  implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUserModel | null> {
    return (this.model as any).findOne({ email });
  }

  async createUser(user: IUserModel): Promise<IUserModel> {
    return this.create(user);
  }

  async findByPhone(phone: string): Promise<IUserModel | null> {
    return (this.model as any).findOne({ phone });
  }

  async findById(userId: string): Promise<IUserModel | null> {
    return (this.model as any).findById(userId);
  }

  async updatePassword(email: string, newHashedPassword: string): Promise<void> {
    await (this.model as any).updateOne(
      { email },
      { $set: { password: newHashedPassword } }
    );
  }

  async updatePasswordById(
    userId: string,
    newHashedPassword: string
  ): Promise<void> {
    await (this.model as any).updateOne(
      { _id: userId },
      { $set: { password: newHashedPassword } }
    );
  }

  async getAllUsers(
    skip: number,
    limit: number,
    filter: Record<string, unknown> = {}
  ): Promise<IUserModel[]> {
    return (this.model as any)
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countUsers(filter: Record<string, unknown> = {}): Promise<number> {
    return (this.model as any).countDocuments(filter);
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

  async getProfileByEmail(email: string): Promise<ProfileDto | null> {
    return this.model.findOne({ email });
  }

  async searchUser(query: string): Promise<IUserModel[]> {
    const regex = new RegExp(query, "i");
    return this.model
      .find({ name: { $regex: regex } })
      .select("name email phone createdAt")
      .limit(10)
      .exec();
  }

  async updateWallet(userId: string, amount: number): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { $inc: { walletBalance: amount } });
  }

  async getFcmTokenById(userId: string): Promise<string | null> {
    const user = await this.model.findById(userId).select("fcmToken");
    return user?.fcmToken || null;
  }



  async updateFcmToken(id: string, token: string): Promise<IUserModel | null> {
    return UserModel.findByIdAndUpdate(
      id,
      { $set: { fcmToken: token } },
      { new: true }
    );
  }

  async toggleSaveTravelPost(userId: string, postId: string): Promise<boolean> {
    const user = await this.model.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const objectId = new Types.ObjectId(postId);
    const current = (user as any).savedTravelPosts as Types.ObjectId[] | undefined;
    const savedPosts = Array.isArray(current) ? current : [];

    const alreadySaved = savedPosts.some((id) => id.toString() === postId);

    if (alreadySaved) {
      (user as any).savedTravelPosts = savedPosts.filter((id) => id.toString() !== postId);
      await user.save();
      return false;
    }

    (user as any).savedTravelPosts = [...savedPosts, objectId];
    await user.save();
    return true;
  }

  async getSavedTravelPostIds(userId: string): Promise<string[]> {
    const user = await this.model.findById(userId).select("savedTravelPosts");
    if (!user) {
      throw new Error("User not found");
    }

    const savedPosts = (user as any).savedTravelPosts as Types.ObjectId[] | undefined;
    return Array.isArray(savedPosts) ? savedPosts.map((id) => id.toString()) : [];
  }
}
