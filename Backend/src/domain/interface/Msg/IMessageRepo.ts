import { IMessage } from "../../entities/MessageEntity";

export interface IMessageRepository {
    createMessage(message: IMessage): Promise<IMessage>;
    getMessages(senderId: string): Promise<IMessage[]>;
    getMessagesOfAChat(chatId: string): Promise<{ messages: IMessage[] }>;
    markMessageAsSeen(messageId: string): Promise<IMessage | null>;
    markAllMessagesAsSeenInChat(chatId: string): Promise<{ modifiedCount: number }>;
    findMessageById(messageId: string): Promise<IMessage | null>;
}
