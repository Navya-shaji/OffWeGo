/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatRepository } from "../../adapters/repository/Chat/ChatRepository";
import { mapToChatOut } from "../../mappers/Chat/mapTochat";

export class GetChatsOfUserUsecase {
    constructor(private chatRepository: ChatRepository) { }

    async execute(userId: string) {
        return await this.chatRepository.findChatByUserId(userId);
    }

    async getChats(userId: string, userType: 'user' | 'vendor' = 'user') {
        const result = await this.chatRepository.findChatsOfUser(userId, userType);
        const chats = result?.chats || [];

        if (!Array.isArray(chats)) {
            return [];
        }

        const formattedChats = chats.map((chat: any) => {
            // Robustly extract IDs as strings
            const chatUserId = chat.userId?._id?.toString() || chat.userId?.toString() || "";
            const chatVendorId = chat.vendorId?._id?.toString() || chat.vendorId?.toString() || "";

            if (!chatUserId || !chatVendorId) {
                return null;
            }

            // identify the "other" person in the conversation
            let otherUser;
            if (chatUserId === userId) {
                otherUser = chat.vendorId;
            } else if (chatVendorId === userId) {
                otherUser = chat.userId;
            } else {
                // Default fallback if current user is neither
                otherUser = userType === 'user' ? chat.vendorId : chat.userId;
            }

            if (!otherUser) {
                return null;
            }

            let otherUserName = "Unknown";
            let otherUserImage = "";

            if (typeof otherUser === 'object' && otherUser !== null) {
                // If populated
                otherUserName = otherUser.name || otherUser.username || "Unknown";
                // Vendor object usually has profileImage, User object usually has imageUrl
                otherUserImage = otherUser.profileImage || otherUser.imageUrl || "";
            }

            const unreadCount = userType === 'user'
                ? (chat.unreadCountUser || 0)
                : (chat.unreadCountVendor || 0);

            return {
                _id: chat._id.toString(),
                name: otherUserName,
                profile_image: otherUserImage,
                isOnline: true,
                lastMessage: chat.lastMessage || "",
                lastMessageAt: chat.lastMessageAt || chat.updatedAt || new Date(),
                userId: chatUserId,
                vendorId: chatVendorId,
                unreadCount: unreadCount,
            };
        }).filter((chat: any) => chat !== null);

        return formattedChats.map((chat: any) => mapToChatOut(chat));
    }
}
