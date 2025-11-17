import { ChatMessage } from "../../entities/chatEntity";

export interface IChatRepository {
  save(message: ChatMessage): Promise<ChatMessage>;
  getMessagesForUser(userId: string): Promise<ChatMessage[]>;
}
