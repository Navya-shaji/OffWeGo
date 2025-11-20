import { model, ObjectId, Document } from "mongoose";
import { ChatMessage } from "../../../domain/entities/chatEntity";
import { ChatMessageSchema } from "../Schema/ChaatSchema";


export interface IChatMessageModel extends Omit<ChatMessage, "_id">, Document {
  _id: ObjectId;
}

export const ChatMessageModel = model<IChatMessageModel>("ChatMessage", ChatMessageSchema);
