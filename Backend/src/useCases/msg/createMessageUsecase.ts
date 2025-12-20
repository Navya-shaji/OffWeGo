import { MessageRepository } from "../../adapters/repository/Msg/MessageRepository";
import { IMessage } from "../../domain/entities/MessageEntity";

export class CreateMessageUseCase {
    constructor(private _messageRepository: MessageRepository) { }

    async createMessage(message: IMessage): Promise<IMessage> {
        console.log("Creating message:", message);
        return await this._messageRepository.createMessage(message);
    }
}

