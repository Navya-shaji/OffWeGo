/* eslint-disable @typescript-eslint/no-explicit-any */
import { isValidObjectId, Types } from "mongoose";
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
        const userObjectId = isValidObjectId(userId) ? new Types.ObjectId(userId) : userId;
        const query: any = {
            $or: [
                { userId: userObjectId },
                { vendorId: userObjectId }
            ]
        };

        const chats = await (chatModel as any).find(query)
            .sort({ lastMessageAt: -1 })
            .populate('userId', 'name username imageUrl')
            .populate('vendorId', 'name profileImage')
            .lean();

        return { chats };
    }

    async getchatOfUser(userId: string, ownerId: string): Promise<any> {
        if (!isValidObjectId(userId) || !isValidObjectId(ownerId)) return null;

        const userObjectId = new Types.ObjectId(userId);
        const ownerObjectId = new Types.ObjectId(ownerId);

        const chat = await (chatModel as any).findOne({
            $and: [
                {
                    $or: [
                        { userId: userObjectId, vendorId: ownerObjectId },
                        { userId: ownerObjectId, vendorId: userObjectId }
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
