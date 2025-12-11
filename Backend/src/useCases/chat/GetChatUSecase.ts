import { ChatRepository } from "../../adapters/repository/Chat/chatRepository";
import { mapToChatOut } from "../../mappers/Chat/mapTochat";

export class GetChatsOfUserUsecase  {
    constructor(private chatRepository: ChatRepository) { }

    async execute(userId: string) {
        return await this.chatRepository.findChatByUserId(userId);
    }

    async getChats(userId: string, userType: 'user' | 'vendor' = 'user') {
        console.log(`🔍 GetChatsUSecase.getChats called: userId=${userId}, userType=${userType}`);
        const result = await this.chatRepository.findChatsOfUser(userId);
        const chats = result?.chats || [];
        console.log(`📊 Repository returned ${chats.length} chats`);
        
        if (!Array.isArray(chats)) {
            console.error("❌ findChatsOfUser did not return an array in chats property:", result);
            return [];
        }
        
        const formattedChats = chats.map((chat: any) => {
      
            if (!chat.userId || !chat.vendorId) {
                console.warn("Chat missing populated fields:", chat._id);
                return null;
            }
            
            // Extract IDs as strings for comparison
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
            
            // Extract userId and vendorId as strings
            const userIdValue = chatUserId;
            const vendorIdValue = chatVendorId;
            
            // Determine unread count based on current user type
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
