import { IMessage } from "../../../domain/entities/MessageEntity";
import { IMessageRepository } from "../../../domain/interface/Msg/IMessageRepo";
import {
  messageModel,
  IMessageModel,
} from "../../../framework/database/Models/MessageModel";

export class MessageRepository implements IMessageRepository {

  async createMessage(message: IMessage): Promise<IMessage> {
    const newMessage = new messageModel({
      ...message,
      seen: message.seen ?? false,
      sendedTime: message.sendedTime ?? new Date(),
    });
    const saved = await newMessage.save();
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
    const messages = await messageModel.find({ chatId }).lean();
    return { messages: messages.map((m) => ({ ...m, _id: m._id.toString() })) };
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
