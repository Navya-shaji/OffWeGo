import { IMessage } from "../../domain/entities/MessageEntity";
import { IGetMessagesUsecase } from "../../domain/interface/Msg/IGetMsgUsecase";
import { IMessageRepository } from "../../domain/interface/Msg/IMessageRepo";

export class GetMessagesUsecase implements IGetMessagesUsecase {
    private _messageRepository: IMessageRepository;
    
    constructor(messageRepository: IMessageRepository) {
        this._messageRepository = messageRepository;
    }
    
    async execute(chatId: string): Promise<{ messages: IMessage[]}> {
        return await this._messageRepository.getMessagesOfAChat(chatId);
    }
}