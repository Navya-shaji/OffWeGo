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
        enum: ['user', 'vendor'],
        required: true
    }

}, {
    timestamps: true
})