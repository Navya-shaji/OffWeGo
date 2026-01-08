import { CreateMessageUseCase } from "../../useCases/msg/createMessageUsecase";
import { ChatRepository } from "../repository/Chat/ChatRepository";
import { FirebaseNotificationService } from "../../framework/Services/FirebaseNotificationService";
import { MessageRepository } from "../repository/Msg/MessageRepository";
import { Role } from "../../domain/constants/Roles";

export class ChatHandler {
    constructor(
        private _sendMessageUseCase: CreateMessageUseCase,
        private _chatRepository: ChatRepository,
        private _notificationService: FirebaseNotificationService,
        private _messageRepository: MessageRepository
    ) { }

    handleConnect(userId: string): void {
        console.log("user connected", userId);
    }

    async handleSendMessage(data: any, senderName: string): Promise<string> {
   

        const message = await this._sendMessageUseCase.createMessage({
            chatId: data.chatId,
            messageContent: data.messageContent,
            messageType: data.messageType || 'text',
            seen: data.seen,
            sendedTime: data.sendedTime,
            senderId: data.senderId,
            senderType: data.senderType,
            receiverId: data.receiverId,
            replyTo: data.replyTo,
        });

      

        const normalizedSenderType = (data.senderType || '').toLowerCase();
        const isVendorSender = normalizedSenderType === 'vendor';
        
        
        if (this._chatRepository && data.receiverId) {
            try {
                const recipientType = isVendorSender ? 'user' : 'vendor';
                await this._chatRepository.incrementUnreadCount(data.chatId, recipientType);
                
            } catch (error) {
                console.error(' Error incrementing unread count:', error);
            }
        }

        if (this._notificationService && data.receiverId) {
            try {
                const recipientType = isVendorSender ? Role.USER : Role.VENDOR;
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

         
            } catch (error) {
                console.error(' Error sending notification:', error);
            }
        }

        return message._id?.toString() || "";
    }

    async handleDeleteMessage(messageId: string): Promise<boolean> {
        try {
            const success = await this._messageRepository.deleteMessage(messageId);
            return success;
        } catch (error) {
            console.error('Error deleting message:', error);
            return false;
        }
    }
}

