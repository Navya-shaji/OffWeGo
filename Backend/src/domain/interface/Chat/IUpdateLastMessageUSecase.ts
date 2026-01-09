import { IChat } from "../../entities/ChatEntity";
import { IMessage } from "../../entities/MessageEntity";


export interface IUpdateLastMessageUseCase {
    updateLastMessage(message: IMessage): Promise<IChat | null>
}