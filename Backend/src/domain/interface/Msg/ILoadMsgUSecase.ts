import { IMessage } from "../../entities/MessageEntity";


export interface ILoadPreviousChatUseCase {
    loadPreviousChat(chatId: string): Promise<{ messages: IMessage[] }>
}