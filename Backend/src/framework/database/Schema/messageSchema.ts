import { Schema } from "mongoose";

export const messageSchema = new Schema({
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
        refPath: 'senderType'
    },
    senderType: {
        type: String,
        enum: ['User', 'user', 'vendor'],
        required: true,
        set: function (value: string) {
            // Normalize 'user' to 'User' on save
            return value === 'user' ? 'User' : value;
        }
    },
    receiverId: {
        type: String,
        refPath: 'senderType',
        required: false
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'voice', 'file'],
        default: 'text'
    },
    deliveryStatus: {
        type: String,
        enum: ['sending', 'sent', 'delivered', 'read'],
        default: 'sent'
    },
    fileUrl: {
        type: String,
        required: false
    },
    fileName: {
        type: String,
        required: false
    },
    fileSize: {
        type: Number,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        required: false
    },
    replyTo: {
        messageId: {
            type: String,
            ref: 'message',
            required: false
        },
        messageContent: {
            type: String,
            required: false
        },
        senderName: {
            type: String,
            required: false
        }
    }
}, {
    timestamps: true
});
