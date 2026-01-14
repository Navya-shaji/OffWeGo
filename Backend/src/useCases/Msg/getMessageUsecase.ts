import { MessageRepository } from "../../adapters/repository/Msg/MessageRepository";
import { IGetMessagesUsecase } from "../../domain/interface/Msg/IGetMsgUsecase";

export class GetMessagesUseCase implements IGetMessagesUsecase {
    constructor(private messageRepository: MessageRepository) { }

    async execute(chatId: string) {
        return await this.messageRepository.getMessages(chatId);
    }
}
