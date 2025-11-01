import { model, Document, ObjectId } from "mongoose";
import { userSchema } from "../Schema/userSchema";
import { User } from "../../../domain/entities/userEntity";

export interface IUserModel extends Omit<User, "_id">, Document {
  _id: ObjectId;
}


export const UserModel = model<IUserModel>("User", userSchema);
