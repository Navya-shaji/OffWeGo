
import { ChatMessage } from "../../../domain/entities/chatEntity";
import { IChatRepository } from "../../../domain/interface/Chat/IchatRepo";
import { ChatMessageModel } from "../../../framework/database/Models/chatModel";



export class ChatRepository implements IChatRepository {
  async save(message: ChatMessage): Promise<ChatMessage> {
    const newMessage = new ChatMessageModel(message);
    const saved = await newMessage.save();
    const obj = typeof (saved as any).toObject === "function" ? (saved as any).toObject() : (saved as any);
    return {
      ...obj,
      _id: obj._id ? obj._id.toString() : undefined,
    } as ChatMessage;
  }

  async getMessagesForUser(userId: string): Promise<ChatMessage[]> {
  const docs = await ChatMessageModel.find({
    $or: [
      { senderId: userId },
      { receiverId: userId }
    ]
  })
  .sort({ createdAt: 1 }) 
  .exec();

  return docs.map((doc) => {
    const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
    return {
      ...obj,
      _id: obj._id.toString(),
    } as ChatMessage;
  });
}

}
