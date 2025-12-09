import { Schema } from "mongoose";
import { IChat } from "../../../domain/entities/chatEntity";

export const chatSchema = new Schema<IChat>({
    lastMessage: {
        type: String
    },
    lastMessageAt: {
        type: Date
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: 'vendor',
        required: true
    },


}, {
    timestamps: true
})