import { MessageRepository } from "../../adapters/repository/Msg/MessageRepository";
import { IMarkMessagesSeenUseCase } from "../../domain/interface/Chat/IMarkMesgusecase";

export class MarkMessagesSeenUseCase implements IMarkMessagesSeenUseCase{
    constructor(private messageRepository: MessageRepository) { }

    async execute(chatId: string, userId: string) {
        return await this.messageRepository.markAsSeen(chatId, userId);
    }
}
