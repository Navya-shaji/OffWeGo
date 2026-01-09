import { chatModel } from "../../../framework/database/Models/chatModel";
import { IChat } from "../../../domain/entities/ChatEntity";

export class ChatRepository {
    async findChat(members: string[]): Promise<IChat | null> {
        return await this.getchatOfUser(members[0], members[1]);
    }

    async createChat(data: IChat): Promise<any> {
   
        const createdChat = await (chatModel as any).create(data);
        const populatedChat = await (chatModel as any).findById(createdChat._id)
            .populate({
                path: 'userId',
                select: 'name username imageUrl'
            })
            .populate({
                path: 'vendorId',
                select: 'name profileImage'
            });

        return populatedChat;
    }

    async findChatById(chatId: string): Promise<IChat | null> {
        return await (chatModel as any).findById(chatId);
    }

    async findChatByUserId(userId: string): Promise<IChat[]> {
  
        return await (chatModel as any).find({
            $or: [
                { userId: userId },
                { vendorId: userId }
            ]
        }).sort({ updatedAt: -1 });
    }

    async findChatsOfUser(userId: string, userType?: 'user' | 'vendor'): Promise<{ chats: any[] }> {
     
        let query: any = {
            $and: [
                { userId: { $ne: null } },
                { vendorId: { $ne: null } }
            ]
        };

        if (userType === 'vendor') {
            query.$and.push({ vendorId: userId });
        } else if (userType === 'user') {
            query.$and.push({ userId: userId });
        } else {
            query.$and.push({
                $or: [
                    { userId: userId },
                    { vendorId: userId }
                ]
            });
        }

        const chats = await (chatModel as any).find(query)
        .sort({ lastMessageAt: -1 })
        .populate('userId', 'name username imageUrl')
        .populate('vendorId', 'name profileImage')
        .lean();
        
        return { chats };
    }

    async getchatOfUser(userId: string, ownerId: string): Promise<any> {
        const userObjectId = userId;
        const ownerObjectId = ownerId;
        
        const chat = await (chatModel as any).findOne({
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
        return await (chatModel as any).findByIdAndUpdate(chatId, {
            lastMessage: message,
            lastMessageAt: time
        });
    }

    async incrementUnreadCount(chatId: string, recipientType: 'user' | 'vendor'): Promise<void> {
        const updateField = recipientType === 'user' ? 'unreadCountUser' : 'unreadCountVendor';
        await (chatModel as any).findByIdAndUpdate(chatId, {
            $inc: { [updateField]: 1 }
        });
    }

    async resetUnreadCount(chatId: string, recipientType: 'user' | 'vendor'): Promise<void> {
        const updateField = recipientType === 'user' ? 'unreadCountUser' : 'unreadCountVendor';
        await (chatModel as any).findByIdAndUpdate(chatId, {
            $set: { [updateField]: 0 }
        });
    }
}
