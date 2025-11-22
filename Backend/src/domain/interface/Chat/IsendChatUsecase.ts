import { ICreateChatDto, IChatOut } from "../../dto/Chat/chatDto";

export interface IInitiateChatUsecase {
    initiateChat(input: ICreateChatDto): Promise<IChatOut>;
}
