import { MessageRepository } from "../../adapters/repository/Msg/MessageRepository";

export class GetMessagesUseCase {
    constructor(private messageRepository: MessageRepository) { }

    async execute(chatId: string, options?: { limit?: number; before?: Date }) {
        return await this.messageRepository.getMessages(chatId, options);
    }
}
