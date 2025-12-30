import { chatModel } from "../../../framework/database/Models/chatModel";
import { IChat } from "../../../domain/entities/chatEntity";

export class ChatRepository {
    async findChat(members: string[]): Promise<IChat | null> {
        // if (members.length !== 2) {
        //     return null;
        // }
        return await this.getchatOfUser(members[0], members[1]);
    }

    async createChat(data: IChat): Promise<any> {
   
        // if (!data.userId || !data.vendorId) {
        //     console.error('❌ Cannot create chat: missing userId or vendorId', data);
        //     throw new Error('Both userId and vendorId are required to create a chat');
        // }
        
        const createdChat = await chatModel.create(data);
        // console.log('✅ Chat created with ID:', createdChat._id);
        // console.log('📝 Raw chat document:', {
        //     _id: createdChat._id,
        //     userId: createdChat.userId,
        //     vendorId: createdChat.vendorId
        // });
        
        // Populate the chat with user and vendor information
        const populatedChat = await chatModel.findById(createdChat._id)
            .populate({
                path: 'userId',
                select: 'name username imageUrl'
            })
            .populate({
                path: 'vendorId',
                select: 'name profileImage'
            });
        
        // console.log('📦 Returning populated chat:', {
        //     _id: populatedChat?._id,
        //     userId: populatedChat?.userId,
        //     vendorId: populatedChat?.vendorId
        // });
        
        return populatedChat;
    }

    async findChatById(chatId: string): Promise<IChat | null> {
        return await chatModel.findById(chatId);
    }

    async findChatByUserId(userId: string): Promise<IChat[]> {
        // Updated to use userId and vendorId instead of members
        return await chatModel.find({
            $or: [
                { userId: userId },
                { vendorId: userId }
            ]
        }).sort({ updatedAt: -1 });
    }

    async findChatsOfUser(userId: string, userType?: 'user' | 'vendor'): Promise<{ chats: any[] }> {
        // Build query based on userType
        // For vendors: only show chats where they are the vendor (vendorId matches)
        // For users: only show chats where they are the user (userId matches)
        let query: any = {
            $and: [
                { userId: { $ne: null } },
                { vendorId: { $ne: null } }
            ]
        };

        if (userType === 'vendor') {
            // Vendor should only see chats where they are the vendor
            query.$and.push({ vendorId: userId });
        } else if (userType === 'user') {
            // User should only see chats where they are the user
            query.$and.push({ userId: userId });
        } else {
            // Fallback: show all chats (for backward compatibility)
            query.$and.push({
                $or: [
                    { userId: userId },
                    { vendorId: userId }
                ]
            });
        }

        const chats = await chatModel.find(query)
        .sort({ lastMessageAt: -1 })
        .populate('userId', 'name username imageUrl')
        .populate('vendorId', 'name profileImage')
        .lean();
        
        return { chats };
    }

    async getchatOfUser(userId: string, ownerId: string): Promise<any> {
        const userObjectId = userId;
        const ownerObjectId = ownerId;
        
        const chat = await chatModel.findOne({
            $and: [
                {
                    $or: [
                        { userId: userObjectId, vendorId: ownerObjectId },
                        { userId: ownerObjectId, vendorId: userObjectId },
                        { userId: userId, vendorId: ownerId },
                        { userId: ownerId, vendorId: userId }
                    ]
                },
                { userId: { $ne: null } },
                { vendorId: { $ne: null } }
            ]
        })
        .populate({
            path: 'userId',
            select: 'name username imageUrl'
        })
        .populate({
            path: 'vendorId',
            select: 'name profileImage'
        });
        
        return chat;
    }

    async updateLastMessage(chatId: string, message: string, time: Date) {
        return await chatModel.findByIdAndUpdate(chatId, {
            lastMessage: message,
            lastMessageAt: time
        });
    }

    async incrementUnreadCount(chatId: string, recipientType: 'user' | 'vendor'): Promise<void> {
        const updateField = recipientType === 'user' ? 'unreadCountUser' : 'unreadCountVendor';
        await chatModel.findByIdAndUpdate(chatId, {
            $inc: { [updateField]: 1 }
        });
    }

    async resetUnreadCount(chatId: string, recipientType: 'user' | 'vendor'): Promise<void> {
        const updateField = recipientType === 'user' ? 'unreadCountUser' : 'unreadCountVendor';
        await chatModel.findByIdAndUpdate(chatId, {
            $set: { [updateField]: 0 }
        });
    }
}
