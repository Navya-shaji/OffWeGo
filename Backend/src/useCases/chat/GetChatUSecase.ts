import { ChatMessage } from "../../domain/entities/chatEntity";
import { IChatRepository } from "../../domain/interface/Chat/IchatRepo";
import { IChatUseCase } from "../../domain/interface/Chat/IGetChatUSecase";


export class ChatUseCase implements IChatUseCase {
  constructor(private _chatRepository: IChatRepository) {}

  async execute(userId: string): Promise<ChatMessage[]> {
    try {
      const conversation = await this._chatRepository.getMessagesForUser(userId);
      return conversation;
    } catch (error) {
      console.error("Error fetching conversation:", error);
      throw new Error("Unable to get conversation");
    }
  }
}
