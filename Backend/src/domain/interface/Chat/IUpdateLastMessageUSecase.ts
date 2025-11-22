import { IChat } from "../../entities/chatEntity";
import { IMessage } from "../../entities/MessageEntity";


export interface IUpdateLastMessageUseCase {
    updateLastMessage(message: IMessage): Promise<IChat | null>
}