/* eslint-disable @typescript-eslint/no-explicit-any */
import { IChat } from "../../entities/ChatEntity";

export interface IChatRepository {
    findChat(members: string[]): Promise<IChat | null>;

    createChat(data: IChat): Promise<any>;

    findChatById(chatId: string): Promise<IChat | null>;

    findChatByUserId(userId: string): Promise<IChat[]>;

    findChatsOfUser(userId: string): Promise<{ chats: any[] }>;

    getchatOfUser(userId: string, ownerId: string): Promise<any>;

    updateLastMessage(chatId: string, message: string, time: Date): Promise<any>;

    incrementUnreadCount(chatId: string, recipientType: "user" | "vendor"): Promise<void>;
}
