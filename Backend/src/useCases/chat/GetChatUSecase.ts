/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatRepository } from "../../adapters/repository/Chat/chatRepository";
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
            if (!chat.userId || !chat.vendorId) {
              
                return null;
            }
            
            const chatUserId = typeof chat.userId === 'object' 
                ? (chat.userId._id?.toString() || chat.userId.toString() || String(chat.userId))
                : String(chat.userId);
            
            const chatVendorId = typeof chat.vendorId === 'object'
                ? (chat.vendorId._id?.toString() || chat.vendorId.toString() || String(chat.vendorId))
                : String(chat.vendorId);
            
          
            
       
            const userIdValue = chatUserId;
            const vendorIdValue = chatVendorId;
            
            // Verify which participant is the current user
            const isCurrentUserTheUser = userId === chatUserId;
            const isCurrentUserTheVendor = userId === chatVendorId;
            
       
            let otherUser;
            let otherUserName = "Unknown";
            let otherUserImage = "";
            
            if (userType === 'user') {
            
                if (isCurrentUserTheUser) {
                    otherUser = chat.vendorId;
                    // Other user is a vendor - use name field
                    if (otherUser) {
                        otherUserName = otherUser.name || "Unknown Vendor";
                        otherUserImage = otherUser.profileImage || "";
                      
                    }
                } else if (isCurrentUserTheVendor) {
                 
                    otherUser = chat.userId;
                    if (otherUser) {
                        otherUserName = otherUser.name || otherUser.username || "Unknown User";
                        otherUserImage = otherUser.imageUrl || otherUser.profileImage || "";
                    }
                } else {
                    
                    otherUser = chat.vendorId;
                    if (otherUser) {
                        otherUserName = otherUser.name || "Unknown Vendor";
                        otherUserImage = otherUser.profileImage || "";
                    }
                }
            } else {
              
                if (isCurrentUserTheVendor) {
                    otherUser = chat.userId;
                    if (otherUser) {
                        otherUserName = otherUser.name || otherUser.username || "Unknown User";
                        otherUserImage = otherUser.imageUrl || otherUser.profileImage || "";
                      
                    }
                } else if (isCurrentUserTheUser) {
                    otherUser = chat.vendorId;
                    if (otherUser) {
                        otherUserName = otherUser.name || "Unknown Vendor";
                        otherUserImage = otherUser.profileImage || "";
                    }
                } else {
            
                    otherUser = chat.userId;
                    if (otherUser) {
                        otherUserName = otherUser.name || otherUser.username || "Unknown User";
                        otherUserImage = otherUser.imageUrl || otherUser.profileImage || "";
                    }
                }
            }
            
            if (!otherUser || otherUserName === "Unknown" || otherUserName === "Unknown Vendor" || otherUserName === "Unknown User") {
                return null;
            }
            
           
            if (userType === 'user') {
                if (!isCurrentUserTheUser) {
                    return null;
                }
                if (otherUser === chat.userId) {
                    return null;
                }
            }
            
            if (userType === 'vendor') {
                if (!isCurrentUserTheVendor) {
                    return null;
                }
                if (otherUser === chat.vendorId) {
                    return null;
                }
            }
            
            const unreadCount = userType === 'user' 
                ? (chat.unreadCountUser || 0)
                : (chat.unreadCountVendor || 0);
            
            return {
                _id: chat._id,
                name: otherUserName,
                profile_image: otherUserImage,
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
