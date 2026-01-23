/* eslint-disable @typescript-eslint/no-explicit-any */
import { messageModel } from "../../../framework/database/Models/MessageModel";
import { IMessage } from "../../../domain/entities/MessageEntity";

export class MessageRepository {
    async saveMessage(data: IMessage): Promise<IMessage> {
        return await messageModel.create(data);
    }

    async createMessage(data: any): Promise<IMessage> {
        console.log("Saving Message to DB:", JSON.stringify(data, null, 2));

        const newMessage = new messageModel({
            chatId: data.chatId,
            senderId: data.senderId,
            senderType: data.senderType?.toLowerCase(),
            receiverId: data.receiverId,
            messageContent: data.messageContent || (data.messageType === 'image' ? 'Sent an image' : (data.messageType === 'location' ? 'Shared Location' : '')),
            messageType: data.messageType || 'text',
            fileUrl: data.fileUrl,
            fileName: data.fileName,
            fileSize: data.fileSize,
            seen: data.seen ?? false,
            sendedTime: new Date(),
            replyTo: data.replyTo
        });
        const saved = await newMessage.save();
        console.log(" Message Saved Successfully:", saved._id);

        return saved.toObject();
    }

    async getMessages(
        chatId: string,
        options?: { limit?: number; before?: Date }
    ): Promise<{ messages: IMessage[]; hasMore: boolean }> {
        const limit = Math.min(Math.max(options?.limit ?? 50, 1), 100);

        const query: any = { chatId };
        if (options?.before) {
            query.sendedTime = { $lt: options.before };
        }

        const docs = await messageModel
            .find(query)
            .sort({ sendedTime: -1 })
            .limit(limit + 1)
            .populate('replyTo.messageId');

        console.log(`[DEBUG] getMessages for chatId: ${chatId}. Query:`, JSON.stringify(query));
        console.log(`[DEBUG] Found ${docs.length} docs`);

        const hasMore = docs.length > limit;
        const slice = hasMore ? docs.slice(0, limit) : docs;
        const messages = slice.reverse().map((d) => (d as any).toObject?.() ?? d);

        return { messages, hasMore };
    }

    async countUnreadMessages(chatId: string, userId: string): Promise<number> {
        return await messageModel.countDocuments({
            chatId,
            senderId: { $ne: userId },
            seen: false
        });
    }

    async markAsSeen(chatId: string, userId: string) {
        return await messageModel.updateMany(
            { chatId, senderId: { $ne: userId } },
            { $set: { seen: true } }
        );
    }

    async deleteMessage(messageId: string): Promise<boolean> {
        try {
            const result = await messageModel.findByIdAndUpdate(
                messageId,
                {
                    $set: {
                        isDeleted: true,
                        deletedAt: new Date(),
                        messageContent: "This message was deleted"
                    }
                },
                { new: true }
            );
            return !!result;
        } catch (error) {
            console.error('Error deleting message:', error);
            return false;
        }
    }
}
