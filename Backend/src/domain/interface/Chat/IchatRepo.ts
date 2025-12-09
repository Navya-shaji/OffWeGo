import { IChat, IChatPopulated } from "../../entities/chatEntity"
import { IMessage } from "../../entities/MessageEntity"

export interface IChatRepository {
    createChat(chat: IChat): Promise<IChatPopulated>
    getchatOfUser(userId: string, ownerId: string): Promise<IChatPopulated | null>
    findChatsOfUser(userId: string): Promise<{ chats: IChatPopulated[] | null }>
    updateLastMessage(message: IMessage): Promise<IChat | null>
    deleteChat(chatId: string): Promise<void>
}
