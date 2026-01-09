import { Document, model, ObjectId } from "mongoose";
import { IMessage } from "../../../domain/entities/MessageEntity";
import { messageSchema } from "../Schema/messageSchema";


export interface IMessageModel extends Omit<IMessage,'_id'>,Document{
    _id: ObjectId;
}

export const messageModel = model<IMessageModel>('message',messageSchema)




