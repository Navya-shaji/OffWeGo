import { ChatMessage } from "../../entities/chatEntity";

export interface IChatUseCase {
  execute(userId: string): Promise<ChatMessage[]>;
}
