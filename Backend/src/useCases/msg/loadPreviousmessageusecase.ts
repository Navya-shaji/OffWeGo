import { IMessage } from "../../domain/entities/MessageEntity"
import { ILoadPreviousChatUseCase } from "../../domain/interface/Msg/ILoadMsgUSecase"
import { IMessageRepository } from "../../domain/interface/Msg/IMessageRepo"


export class LoadPreviousChatUseCase implements ILoadPreviousChatUseCase{
    private _messageDatabase: IMessageRepository
    constructor(messageDatabase: IMessageRepository) {
        this._messageDatabase = messageDatabase
    }
    async loadPreviousChat(chatId: string): Promise<{ messages:IMessage[] }> {
        return await this._messageDatabase.getMessagesOfAChat(chatId)
    }
}