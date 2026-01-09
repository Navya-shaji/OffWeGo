import { MessageRepository } from "../../adapters/repository/Msg/MessageRepository";
import { ChatRepository } from "../../adapters/repository/Chat/ChatRepository";

export class MarkMessagesSeenUseCase {
    constructor(
        private messageRepository: MessageRepository,
        private chatRepository: ChatRepository
    ) { }

    async execute(chatId: string, userId: string, userType: 'user' | 'vendor' = 'user') {
  
        await this.messageRepository.markAsSeen(chatId, userId);
        // Reset unread count
        await this.chatRepository.resetUnreadCount(chatId, userType);
    }
}
