import { IChatRepository } from "../../domain/interface/Chat/IchatRepo";
import { IChatOut } from "../../domain/dto/Chat/chatDto";
import { IGetChatsOfUserUsecase } from "../../domain/interface/Chat/IGetChatUSecase";
import { mapToChatOut } from "../../mappers/Chat/mapTochat";

export class GetChatsOfUserUsecase implements IGetChatsOfUserUsecase {
    constructor(private chatRepository: IChatRepository) {}

    async getChats(userId: string): Promise<IChatOut[]> {
        const result = await this.chatRepository.findChatsOfUser(userId);

        if (!result || !result.chats) return [];

        const chats = result.chats;

        const formattedChats = chats.map(chat => {
            const otherUser =
                chat.userId._id.toString() === userId
                    ? chat.vendorId
                    : chat.userId;

            return {
                _id: chat._id,
                name: otherUser.name,
                profile_image: otherUser.imageUrl || otherUser.profileImage || "",
                isOnline: true, 
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt,
            };
        });

        return formattedChats.map(chat => mapToChatOut(chat));
    }
}
