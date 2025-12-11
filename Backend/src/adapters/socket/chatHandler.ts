import { CreateMessageUseCase } from "../../useCases/msg/createMessageUsecase";
import { ChatRepository } from "../repository/Chat/chatRepository";
import { FirebaseNotificationService } from "../../framework/Services/FirebaseNotificationService";

export class ChatHandler {
    constructor(
        private _sendMessageUseCase: CreateMessageUseCase,
        private _chatRepository: ChatRepository,
        private _notificationService: FirebaseNotificationService
    ) { }

    handleConnect(userId: string): void {
        console.log("user connected", userId);
    }

    async handleSendMessage(data: any, senderName: string): Promise<string> {
        console.log('📨 handleSendMessage called with:', {
            chatId: data.chatId,
            senderId: data.senderId,
            senderType: data.senderType,
            messageContent: data.messageContent?.substring(0, 50)
        });

        const message = await this._sendMessageUseCase.createMessage({
            chatId: data.chatId,
            messageContent: data.messageContent,
            messageType: data.messageType || 'text',
            seen: data.seen,
            sendedTime: data.sendedTime,
            senderId: data.senderId,
            senderType: data.senderType,
            receiverId: data.receiverId,
        });

        console.log('✅ Message saved with ID:', message._id);

        // Normalize senderType for comparison (handle 'User', 'user', 'vendor')
        const normalizedSenderType = (data.senderType || '').toLowerCase();
        const isVendorSender = normalizedSenderType === 'vendor';
        
        // Increment unread count
        if (this._chatRepository && data.receiverId) {
            try {
                const recipientType = isVendorSender ? 'user' : 'vendor';
                await this._chatRepository.incrementUnreadCount(data.chatId, recipientType);
                console.log(`📊 Incremented unread count for ${recipientType}`);
            } catch (error) {
                console.error('❌ Error incrementing unread count:', error);
            }
        }

        // Send notification
        if (this._notificationService && data.receiverId) {
            try {
                const recipientType = isVendorSender ? 'user' : 'vendor';
                const title = `New message from ${senderName || 'someone'}`;
                const messagePreview = data.messageContent.length > 50
                    ? data.messageContent.substring(0, 50) + '...'
                    : data.messageContent;

                await this._notificationService.send({
                    recipientId: data.receiverId,
                    recipientType: recipientType,
                    title: title,
                    message: messagePreview,
                    read: false
                });

                console.log(`🔔 Notification sent to ${recipientType}: ${data.receiverId}`);
            } catch (error) {
                console.error('❌ Error sending notification:', error);
            }
        }

        return message._id?.toString() || "";
    }
}

