import { IMessage } from "../../../domain/entities/MessageEntity";
import { IMessageRepository } from "../../../domain/interface/Msg/IMessageRepo";
import {
  messageModel,
  IMessageModel,
} from "../../../framework/database/Models/MessageModel";

export class MessageRepository implements IMessageRepository {

  async createMessage(message: IMessage): Promise<IMessage> {
    console.log('💾 MessageRepository.createMessage called with:', {
      chatId: message.chatId,
      senderId: message.senderId,
      senderType: message.senderType,
      messageContent: message.messageContent?.substring(0, 50)
    });

    const newMessage = new messageModel({
      ...message,
      seen: message.seen ?? false,
      sendedTime: message.sendedTime ?? new Date(),
    });
    const saved = await newMessage.save();

    console.log('✅ Message saved to DB with ID:', saved._id);
    return saved.toObject() as IMessage;
  }

  async getMessages(senderId: string): Promise<IMessage[]> {
    const messages = await messageModel
      .find({ senderId })
      .sort({ sendedTime: 1 })
      .lean<IMessageModel>()
      .exec();
    return messages as unknown as IMessage[];
  }

  async getMessagesOfAChat(chatId: string): Promise<{ messages: IMessage[] }> {
    console.log('📥 getMessagesOfAChat called for chatId:', chatId);

    const messages = await messageModel.find({ chatId }).lean();

    console.log('📦 Found', messages.length, 'messages for chat:', chatId);

    return {
      messages: messages.map((m: any) => ({
        ...m,
        _id: m._id ? m._id.toString() : undefined,
        sendedTime: m.sendedTime || new Date() // Ensure sendedTime exists
      })) as IMessage[]
    };
  }

  async markMessageAsSeen(messageId: string): Promise<IMessage | null> {
    const updated = await messageModel
      .findByIdAndUpdate(messageId, { seen: true }, { new: true })
      .lean<IMessageModel>()
      .exec();
    return updated as IMessage | null;
  }

  async markAllMessagesAsSeenInChat(
    chatId: string
  ): Promise<{ modifiedCount: number }> {
    const result = await messageModel.updateMany(
      { chatId, seen: false },
      { seen: true }
    );
    return { modifiedCount: result.modifiedCount };
  }


  async findMessageById(messageId: string): Promise<IMessage | null> {
    const message = await messageModel
      .findById(messageId)
      .lean<IMessageModel>()
      .exec();
    return message as IMessage | null;
  }
}
