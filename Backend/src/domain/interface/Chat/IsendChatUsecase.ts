
import { ChatDto } from "../../dto/Chat/chatDto";

export interface ISendChatMessageUseCase {
  execute(messageDto: ChatDto): Promise<ChatDto>;
}
