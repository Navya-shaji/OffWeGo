import { Socket } from "socket.io";
import { Server as SocketIOServer } from "socket.io";
import { chatHandler } from "../Di/Chat/ChatInjection";

export class ChatEventHandler {
    private _socket: Socket;
    private _io: SocketIOServer;

    constructor(_socket: Socket, _io: SocketIOServer) {
        this._socket = _socket;
        this._io = _io;
        this._setHandler();
    }

    private _setHandler(): void {
        // User registration
        this._socket.on("register_user", ({ userId }: { userId: string }) => {
            chatHandler.handleConnect(userId);
            this._socket.join(`user_${userId}`); // Join user-specific room
            this._io.emit("user-status-changed", {
                userId: userId,
                isOnline: true,
            });
        });

        // Vendor registration
        this._socket.on("register_vendor", ({ vendorId }: { vendorId: string }) => {
            chatHandler.handleConnect(vendorId);
            this._socket.join(`vendor_${vendorId}`); // Join vendor-specific room
            this._io.emit("vendor-status-changed", {
                vendorId: vendorId,
                isOnline: true,
            });
        });

        this._socket.on("join_room", ({ roomId }: { roomId: string }) => {
            console.log('🚪 User joining room:', roomId, 'Socket ID:', this._socket.id);
            this._socket?.join(roomId);
        });

        this._socket.on("send_message", async (data: any, ack: (id: string) => void) => {
            console.log('📤 send_message event received:', {
                chatId: data.chatId,
                senderId: data.senderId,
                senderType: data.senderType,
                messageContent: data.messageContent?.substring(0, 50)
            });

            const senderName = data.senderName || 'Someone';
            const id = await chatHandler.handleSendMessage(data, senderName);
            ack(id);

            console.log('📡 Broadcasting to room:', data.chatId, 'with message ID:', id);

            // Broadcast message to chat room
            this._io.to(data.chatId).emit("receive-message", {
                ...data,
                _id: id,
                replyTo: data.replyTo // Ensure replyTo data is included
            });

            // Emit notification event to recipient's personal room
            if (data.receiverId) {
                // Normalize senderType for comparison (handle 'User', 'user', 'vendor')
                const normalizedSenderType = (data.senderType || '').toLowerCase();
                const isVendorSender = normalizedSenderType === 'vendor';
                const recipientRoom = isVendorSender 
                    ? `user_${data.receiverId}` 
                    : `vendor_${data.receiverId}`;
                
                this._io.to(recipientRoom).emit("new-message-notification", {
                    chatId: data.chatId,
                    senderId: data.senderId,
                    senderName: senderName,
                    messagePreview: data.messageContent.substring(0, 50),
                    timestamp: new Date()
                });

                console.log(`🔔 Notification sent to room: ${recipientRoom}`);
            }

            console.log('✅ Message broadcasted to room:', data.chatId);
        });

        // Handle message deletion
        this._socket.on(
            "delete_message",
            async (
                { messageId, chatId }: { messageId: string; chatId: string },
                ack?: (res: { success: boolean; message?: string }) => void
            ) => {
                try {
                    if (!messageId || !chatId) {
                        if (ack) ack({ success: false, message: "messageId and chatId are required" });
                        return;
                    }

                    const success = await chatHandler.handleDeleteMessage(messageId);
                    if (!success) {
                        if (ack) ack({ success: false, message: "Failed to delete message" });
                        return;
                    }

                    this._io.to(chatId).emit("message_deleted", { messageId, chatId });
                    if (ack) ack({ success: true });
                } catch (error) {
                    console.error("Error in delete_message handler:", error);
                    if (ack) ack({ success: false, message: "Server error" });
                }
            }
        );

        // Handle messages marked as seen
        this._socket.on("mark_messages_seen", async ({ chatId, userId }: { chatId: string; userId: string }) => {
            console.log('👁️ Marking messages as seen:', { chatId: chatId, userId: userId });
            // This will be handled by the frontend calling the API
            this._io.to(chatId).emit("messages-seen", { chatId: chatId, userId: userId });
        });

        // Handle typing indicators
        this._socket.on("typing", ({ roomId, userId }: { roomId: string; userId: string }) => {
            this._socket.to(roomId).emit("typing", { userId: userId });
        });

        this._socket.on("stop-typing", ({ roomId, userId }: { roomId: string; userId: string }) => {
            this._socket.to(roomId).emit("stop-typing", { userId: userId });
        });
    }
}

