import { Schema } from "mongoose";
import { IChat } from "../../../domain/entities/chatEntity";

export const chatSchema = new Schema<IChat>({
    lastMessage: {
        type: String
    },
    lastMessageAt: {
        type: Date
    },
    receiverId: {
        type: String,
        ref: 'User'
    },
    senderId: {
        type: String,
        ref: 'User'
    },
    receiverType: {
        type: String,
        required: true,
        enum: ['user', 'vendor']
    },
    senderType: {
        type: String,
        required: true,
        enum: ['user', 'vendor']
    }
}, {
    timestamps: true
})