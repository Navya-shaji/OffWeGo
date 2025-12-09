import { Schema } from "mongoose";
import { IMessage } from "../../../domain/entities/MessageEntity";


export const messageSchema = new Schema<IMessage>({
    chatId: {
        type: String,
        ref: 'chat',
        required: true
    },
    messageContent: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    },
    sendedTime: {
        type: Date,
        default: Date.now
    },
    senderId: {
        type: String,
        refPath: 'Role'

    },
    senderType: {
        type: String,
        enum: ['User', 'user', 'vendor'],
        required: true,
        set: (value: string) => {
            // Normalize 'user' to 'User' on save
            return value === 'user' ? 'User' : value;
        }
    },
    receiverId: {
        type: String,
        refPath: 'Role',
        required: false
    }

}, {
    timestamps: true
})