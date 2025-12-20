import { ObjectId } from "mongoose";

export interface IMessage {
    _id?: ObjectId;
    chatId: string;
    senderId: string;
    messageContent: string;
    messageType: "text" | "image" | "video";
    seen: boolean;
    sendedTime?: Date;
    senderType?: string;
    receiverId?: string;
}
