import { IChatRepository } from "../../domain/interface/Chat/IchatRepo";
import { IChatOut } from "../../domain/dto/Chat/chatDto";
import { IGetChatsOfUserUsecase } from "../../domain/interface/Chat/IGetChatUSecase";
import { mapToChatOut } from "../../mappers/Chat/mapTochat";

export class GetChatsOfUserUsecase implements IGetChatsOfUserUsecase {
    constructor(private chatRepository: IChatRepository) { }

    async getChats(userId: string): Promise<IChatOut[]> {
        const result = await this.chatRepository.findChatsOfUser(userId);

        const chats = result?.chats || [];

        if (!Array.isArray(chats)) {
            console.error("findChatsOfUser did not return an array in chats property:", result);
            return [];
        }

        const formattedChats = chats.map(chat => {
            // Check if populated fields exist
            if (!chat.userId || !chat.vendorId) {
                console.warn("Chat missing populated fields:", chat._id);
                return null;
            }

            const otherUser =
                chat.userId._id.toString() === userId
                    ? chat.vendorId
                    : chat.userId;

            return {
                _id: chat._id,
                name: otherUser?.name || "Unknown",
                profile_image:
                    (otherUser as any)?.imageUrl ||
                    (otherUser as any)?.profileImage ||
                    "",
                isOnline: true,
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt,
            };
        }).filter(chat => chat !== null) as any[]; // Filter out nulls

        return formattedChats.map(chat => mapToChatOut(chat));
    }
}
