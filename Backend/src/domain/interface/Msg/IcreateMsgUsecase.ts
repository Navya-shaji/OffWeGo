import { IMessage } from "../../entities/MessageEntity";

export interface ICreateMessageUsecase {
    createMessage(message: IMessage): Promise<IMessage>;
}