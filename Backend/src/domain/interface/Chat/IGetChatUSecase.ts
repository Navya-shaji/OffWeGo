import { IChatOut } from "../../dto/Chat/chatDto";

export interface IGetChatsOfUserUsecase {
    getChats(userId: string): Promise<IChatOut[]>;
}
