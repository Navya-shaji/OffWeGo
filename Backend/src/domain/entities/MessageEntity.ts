import { ObjectId } from "mongoose";

export interface IMessage {
    _id?: ObjectId;
    chatId: string;
    senderId: string;
    messageContent: string;
    messageType: "text" | "image" | "video" | "voice" | "file";
    seen: boolean;
    sendedTime?: Date;
    senderType?: string;
    receiverId?: string;
    deliveryStatus?: "sending" | "sent" | "delivered" | "read";
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    isDeleted?: boolean;
    deletedAt?: Date;
    replyTo?: {
        messageId?: string;
        messageContent?: string;
        senderName?: string;
    };
}
