import { model, Document, ObjectId } from "mongoose";
import { User } from "../../../domain/entities/UserEntity";
import { userSchema } from "../Schema/userSchema";

export interface IUserModel extends Omit<User, "_id">, Document {
  _id: ObjectId;
}


export const UserModel = model<IUserModel>("user", userSchema);
