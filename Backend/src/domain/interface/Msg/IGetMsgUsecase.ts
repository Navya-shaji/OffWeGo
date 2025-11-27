import { IMessage } from "../../entities/MessageEntity";

export interface IGetMessagesUsecase {
    execute(chatId: string): Promise<{ messages: IMessage[] }>;
}