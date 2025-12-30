import { messageModel } from "../../../framework/database/Models/MessageModel";
import { IMessage } from "../../../domain/entities/MessageEntity";

export class MessageRepository {
    async saveMessage(data: IMessage): Promise<IMessage> {
        return await messageModel.create(data);
    }

    async createMessage(data: any): Promise<IMessage> {
        console.log('💾 MessageRepository.createMessage called with:', {
            chatId: data.chatId,
            senderId: data.senderId,
            senderType: data.senderType,
            messageContent: data.messageContent?.substring(0, 50)
        });
        const newMessage = new messageModel({
            chatId: data.chatId,
            senderId: data.senderId,
            senderType: data.senderType,
            receiverId: data.receiverId,
            messageContent: data.messageContent,
            messageType: data.messageType || 'text',
            seen: data.seen ?? false,
            sendedTime: data.sendedTime ?? new Date(),
            replyTo: data.replyTo
        });
        const saved = await newMessage.save();
        console.log('✅ Message saved to DB with ID:', saved._id);
        return saved.toObject();
    }

    async getMessages(chatId: string): Promise<IMessage[]> {
        return await messageModel.find({ chatId }).sort({ sendedTime: 1 }).populate('replyTo.messageId');
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
