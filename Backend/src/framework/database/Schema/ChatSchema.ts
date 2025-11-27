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
        refPath: 'receiverType'
    },
    vendorId: {
        type: Schema.Types.ObjectId,
        refPath: 'senderType'
    },


}, {
    timestamps: true
})