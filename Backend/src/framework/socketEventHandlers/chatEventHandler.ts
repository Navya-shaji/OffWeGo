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

        this._socket.on("register_user", ({ userId }: { userId: string }) => {
            chatHandler.handleConnect(userId);
            const socketData = this._socket;
            socketData.data = socketData.data || {};
            socketData.data.role = 'user';
            socketData.data.userId = userId;
            this._socket.join(`user_${userId}`);
            this._io.emit("user-status-changed", {
                userId: userId,
                isOnline: true,
            });

            const onlineIds: string[] = [];
            for (const s of this._io.sockets.sockets.values()) {
                const role = (s).data?.role;
                const id = role === 'vendor' ? (s).data?.vendorId : (s).data?.userId;
                if (id) onlineIds.push(String(id));
            }
            this._socket.emit('online-users', { onlineIds });
        });

        // Vendor registration
        this._socket.on("register_vendor", ({ vendorId }: { vendorId: string }) => {
            chatHandler.handleConnect(vendorId);
            (this._socket).data = (this._socket).data || {};
            (this._socket).data.role = 'vendor';
            (this._socket).data.vendorId = vendorId;
            this._socket.join(`vendor_${vendorId}`);
            this._io.emit("vendor-status-changed", {
                vendorId: vendorId,
                isOnline: true,
            });

            const onlineIds: string[] = [];
            for (const s of this._io.sockets.sockets.values()) {
                const role = (s).data?.role;
                const id = role === 'vendor' ? (s).data?.vendorId : (s).data?.userId;
                if (id) onlineIds.push(String(id));
            }
            this._socket.emit('online-users', { onlineIds });
        });

        this._socket.on("join_room", ({ roomId }: { roomId: string }) => {
            this._socket?.join(roomId);
        });

        this._socket.on("send_message", async (data, ack: (id: string) => void) => {


            const senderName = data.senderName || 'Someone';
            const id = await chatHandler.handleSendMessage(data, senderName);
            ack(id);


            this._io.to(data.chatId).emit("receive-message", {
                ...data,
                _id: id,
                replyTo: data.replyTo
            });

            // Also notify the recipient's private room to update sidebar/unread counts
            if (data.receiverId) {
                const normalizedSenderType = (data.senderType || '').toLowerCase();
                const isVendorSender = normalizedSenderType === 'vendor';
                const recipientRoom = isVendorSender
                    ? `user_${data.receiverId}`
                    : `vendor_${data.receiverId}`;

                // We emit receive-message to the private room as well so the sidebar can update
                this._io.to(recipientRoom).emit("receive-message", {
                    ...data,
                    _id: id,
                    replyTo: data.replyTo
                });

                this._io.to(recipientRoom).emit("new-message-notification", {
                    chatId: data.chatId,
                    senderId: data.senderId,
                    senderName: senderName,
                    messagePreview: data.messageContent.substring(0, 50),
                    timestamp: new Date()
                });

            }

        });

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
                } catch {
                    if (ack) ack({ success: false, message: "Server error" });
                }
            }
        );

        this._socket.on("mark_messages_seen", async ({ chatId, userId }: { chatId: string; userId: string }) => {
            this._io.to(chatId).emit("messages-seen", { chatId: chatId, userId: userId });
        });

        this._socket.on("typing", ({ roomId, userId }: { roomId: string; userId: string }) => {
            this._socket.to(roomId).emit("typing", { userId: userId });
        });

        this._socket.on("stop-typing", ({ roomId, userId }: { roomId: string; userId: string }) => {
            this._socket.to(roomId).emit("stop-typing", { userId: userId });
        });
    }
}

