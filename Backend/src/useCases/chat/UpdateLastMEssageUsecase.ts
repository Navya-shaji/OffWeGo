// import { IChat } from "../../domain/entities/chatEntity";
// import { IMessage } from "../../domain/entities/MessageEntity";
// import { IChatRepository } from "../../domain/interface/Chat/IchatRepo";
// import { IUpdateLastMessageUseCase } from "../../domain/interface/Chat/IUpdateLastMessageUSecase";


// export class UpdateLastMessageUseCase implements IUpdateLastMessageUseCase {

//     constructor(private chatRepository: IChatRepository) {}

//     async updateLastMessage(message: IMessage): Promise<IChat | null> {

//         if (!message.chatId) {
//             throw new Error("chatId is required");
//         }

//         return await this.chatRepository.updateLastMessage(message);
//     }
// }
