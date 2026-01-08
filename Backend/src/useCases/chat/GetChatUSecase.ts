/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatRepository } from "../../adapters/repository/Chat/ChatRepository";
import { mapToChatOut } from "../../mappers/Chat/mapTochat";

export class GetChatsOfUserUsecase  {
    constructor(private chatRepository: ChatRepository) { }

    async execute(userId: string) {
        return await this.chatRepository.findChatByUserId(userId);
    }

    async getChats(userId: string, userType: 'user' | 'vendor' = 'user') {
        const result = await this.chatRepository.findChatsOfUser(userId);
        const chats = result?.chats || [];
        
        if (!Array.isArray(chats)) {
            return [];
        }
        
        const formattedChats = chats.map((chat: any) => {
      
            if (!chat.userId || !chat.vendorId) {
                return null;
            }
            
     
            const chatUserId = typeof chat.userId === 'object' 
                ? (chat.userId._id?.toString() || chat.userId.toString())
                : chat.userId.toString();
            
            const chatVendorId = typeof chat.vendorId === 'object'
                ? (chat.vendorId._id?.toString() || chat.vendorId.toString())
                : chat.vendorId.toString();
            
          
            let otherUser;
            if (userType === 'user') {
           
                otherUser = chat.vendorId;
            } else {
            
                otherUser = chat.userId;
            }
            
           
            const userIdValue = chatUserId;
            const vendorIdValue = chatVendorId;
            
        
            const unreadCount = userType === 'user' 
                ? (chat.unreadCountUser || 0)
                : (chat.unreadCountVendor || 0);
            
            return {
                _id: chat._id,
                name: otherUser?.name || "Unknown",
                profile_image: otherUser?.imageUrl || otherUser?.profileImage || "",
                isOnline: true,
                lastMessage: chat.lastMessage || "",
                lastMessageAt: chat.lastMessageAt || new Date(),
                userId: userIdValue,
                vendorId: vendorIdValue,
                unreadCount: unreadCount,
            };
        }).filter((chat: any) => chat !== null);
        
        return formattedChats.map((chat: any) => mapToChatOut(chat));
    }
}
