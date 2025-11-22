import { IChatRepository } from "../../domain/interface/Chat/IchatRepo";
import { IChatOut } from "../../domain/dto/Chat/chatDto";
import { IGetChatsOfUserUsecase } from "../../domain/interface/Chat/IGetChatUSecase";

export class GetChatsOfUserUsecase implements IGetChatsOfUserUsecase {
    private chatRepository: IChatRepository;

    constructor(chatRepository: IChatRepository) {
        this.chatRepository = chatRepository;
    }

    async getChats(userId: string): Promise<IChatOut[]> {
        const result = await this.chatRepository.findChatsOfUser(userId);

        if (!result || !result.chats) return [];

        const chats = result.chats;

        const formattedChats: IChatOut[] = chats.map(chat => {
            const otherUser =
                chat.senderId._id.toString() === userId
                    ? chat.receiverId
                    : chat.senderId;

            return {
                _id: chat._id,
                name: otherUser.name,
                profile_image: otherUser.profile_image || "",
                isOnline: true,        
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt,
            };
        });

        return formattedChats;
    }
}
