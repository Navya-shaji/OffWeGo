import { Document, model, ObjectId } from "mongoose";
import { IChat } from "../../../domain/entities/chatEntity";
import { chatSchema } from "../Schema/ChatSchema";


export interface IChatModel extends Omit<IChat,'_id'>,Document{
    _id: ObjectId;
}

export const chatModel = model<IChat>('chat',chatSchema)