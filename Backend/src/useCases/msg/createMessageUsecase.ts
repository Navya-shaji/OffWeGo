import { IMessage } from "../../domain/entities/MessageEntity"
import { ICreateMessageUsecase } from "../../domain/interface/Msg/IcreateMsgUsecase"
import { IMessageRepository } from "../../domain/interface/Msg/IMessageRepo"


export class CreateMessageUseCase implements ICreateMessageUsecase {
    private _messageRepository: IMessageRepository
    constructor(messageDatabase: IMessageRepository) {
        this._messageRepository = messageDatabase
    }
    async createMessage(message: IMessage): Promise<IMessage> {
        console.log(message)
        return this._messageRepository.createMessage(message) 
    }
}   