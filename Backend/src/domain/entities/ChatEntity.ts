import { ObjectId } from "mongoose";

export interface IChat {
    _id?: ObjectId;
    userId: ObjectId | string;
    vendorId: ObjectId | string;
    lastMessage?: string;
    lastMessageAt?: Date;
    unreadCountUser?: number;
    unreadCountVendor?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
