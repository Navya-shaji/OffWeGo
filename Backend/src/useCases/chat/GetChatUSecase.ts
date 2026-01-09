import { ChatRepository } from "../../adapters/repository/Chat/chatRepository";
import { mapToChatOut } from "../../mappers/Chat/mapTochat";

export class GetChatsOfUserUsecase {
    constructor(private chatRepository: ChatRepository) { }

    async execute(userId: string) {
        return await this.chatRepository.findChatByUserId(userId);
    }

    async getChats(userId: string, userType: 'user' | 'vendor' = 'user') {
        console.log(`🔍 GetChatsUSecase.getChats called: userId=${userId}, userType=${userType}`);
        const result = await this.chatRepository.findChatsOfUser(userId, userType);
        const chats = result?.chats || [];
        console.log(`📊 Repository returned ${chats.length} chats for ${userType}`);
        
        if (!Array.isArray(chats)) {
            console.error("❌ findChatsOfUser did not return an array in chats property:", result);
            return [];
        }
        
        const formattedChats = chats.map((chat: any) => {
            // Check if populated fields exist
            if (!chat.userId || !chat.vendorId) {
                console.warn("Chat missing populated fields:", chat._id);
                return null;
            }
            
            // Extract IDs as strings for comparison - ensure consistent string format
            const chatUserId = typeof chat.userId === 'object' 
                ? (chat.userId._id?.toString() || chat.userId.toString() || String(chat.userId))
                : String(chat.userId);
            
            const chatVendorId = typeof chat.vendorId === 'object'
                ? (chat.vendorId._id?.toString() || chat.vendorId.toString() || String(chat.vendorId))
                : String(chat.vendorId);
            
            // Ensure userId parameter is also a string for comparison
            const currentUserId = String(userId);
            
            // Extract userId and vendorId as strings for comparison
            const userIdValue = chatUserId;
            const vendorIdValue = chatVendorId;
            
            // Verify which participant is the current user
            const isCurrentUserTheUser = userId === chatUserId;
            const isCurrentUserTheVendor = userId === chatVendorId;
            
            console.log(`🔍 Chat ${chat._id} - Current userId: ${userId}, Chat userId: ${chatUserId}, Chat vendorId: ${chatVendorId}`);
            console.log(`   - Is current user the user? ${isCurrentUserTheUser}, Is current user the vendor? ${isCurrentUserTheVendor}`);
            
            // Determine which user is the "other" user based on userType and actual chat structure
            let otherUser;
            let otherUserName = "Unknown";
            let otherUserImage = "";
            
            if (userType === 'user') {
                // Current user is a user, so other user should be vendor
                // Verify: current userId should match chat.userId, and we show chat.vendorId
                if (isCurrentUserTheUser) {
                    otherUser = chat.vendorId;
                    // Other user is a vendor - use name field
                    if (otherUser) {
                        otherUserName = otherUser.name || "Unknown Vendor";
                        otherUserImage = otherUser.profileImage || "";
                        console.log(`✅ User side - Showing vendor: ${otherUserName}`, {
                            name: otherUser.name,
                            profileImage: otherUser.profileImage,
                            vendorId: chatVendorId
                        });
                    }
                } else if (isCurrentUserTheVendor) {
                    // This shouldn't happen for userType='user', but handle it
                    console.warn(`⚠️ User type mismatch: userId ${userId} is vendor in chat ${chat._id}`);
                    otherUser = chat.userId;
                    if (otherUser) {
                        otherUserName = otherUser.name || otherUser.username || "Unknown User";
                        otherUserImage = otherUser.imageUrl || otherUser.profileImage || "";
                    }
                } else {
                    // Fallback: assume current user is the user
                    console.warn(`⚠️ ID mismatch: assuming current user is the user for chat ${chat._id}`);
                    otherUser = chat.vendorId;
                    if (otherUser) {
                        otherUserName = otherUser.name || "Unknown Vendor";
                        otherUserImage = otherUser.profileImage || "";
                    }
                }
            } else {
                // Current user is a vendor, so other user should be user
                // Verify: current userId should match chat.vendorId, and we show chat.userId
                if (isCurrentUserTheVendor) {
                    otherUser = chat.userId;
                    // Other user is a user - check for name or username
                    if (otherUser) {
                        otherUserName = otherUser.name || otherUser.username || "Unknown User";
                        otherUserImage = otherUser.imageUrl || otherUser.profileImage || "";
                        console.log(`✅ Vendor side - Showing user: ${otherUserName}`, {
                            name: otherUser.name,
                            username: otherUser.username,
                            imageUrl: otherUser.imageUrl,
                            profileImage: otherUser.profileImage
                        });
                    }
                } else if (isCurrentUserTheUser) {
                    // This shouldn't happen for userType='vendor', but handle it
                    console.warn(`⚠️ Vendor type mismatch: userId ${userId} is user in chat ${chat._id}`);
                    otherUser = chat.vendorId;
                    if (otherUser) {
                        otherUserName = otherUser.name || "Unknown Vendor";
                        otherUserImage = otherUser.profileImage || "";
                    }
                } else {
                    // Fallback: assume current user is the vendor
                    console.warn(`⚠️ ID mismatch: assuming current user is the vendor for chat ${chat._id}`);
                    otherUser = chat.userId;
                    if (otherUser) {
                        otherUserName = otherUser.name || otherUser.username || "Unknown User";
                        otherUserImage = otherUser.imageUrl || otherUser.profileImage || "";
                    }
                }
            }
            
            // Only return chat if we successfully identified the other user
            if (!otherUser || otherUserName === "Unknown" || otherUserName === "Unknown Vendor" || otherUserName === "Unknown User") {
                console.warn(`⚠️ Skipping chat ${chat._id}: Could not identify other user (name: ${otherUserName})`);
                return null;
            }
            
            // CRITICAL: Verify the chat belongs to the current user in the expected role
            // For userType='user': current user MUST be the user in the chat (chat.userId)
            // For userType='vendor': current user MUST be the vendor in the chat (chat.vendorId)
            if (userType === 'user') {
                if (!isCurrentUserTheUser) {
                    console.warn(`⚠️ Skipping chat ${chat._id}: User ${userId} is not the user in this chat (chat.userId=${chatUserId})`);
                    return null;
                }
                // Double-check: we should be showing vendor, not user
                if (otherUser === chat.userId) {
                    console.warn(`⚠️ Skipping chat ${chat._id}: Wrong participant - showing user instead of vendor`);
                    return null;
                }
            }
            
            if (userType === 'vendor') {
                if (!isCurrentUserTheVendor) {
                    console.warn(`⚠️ Skipping chat ${chat._id}: Vendor ${userId} is not the vendor in this chat (chat.vendorId=${chatVendorId})`);
                    return null;
                }
                // Double-check: we should be showing user, not vendor
                if (otherUser === chat.vendorId) {
                    console.warn(`⚠️ Skipping chat ${chat._id}: Wrong participant - showing vendor instead of user`);
                    return null;
                }
            }
            
            // Determine unread count based on current user type
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
