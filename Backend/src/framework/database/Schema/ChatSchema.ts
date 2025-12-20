import { Schema } from "mongoose";

export const chatSchema = new Schema({
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
    unreadCountUser: {
        type: Number,
        default: 0
    },
    unreadCountVendor: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
