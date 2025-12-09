import { Server, Socket } from "socket.io";
import { chatHandler } from "../Di/Chat/ChatInjection";
export class ChatEventHandler {
  constructor(private _socket: Socket, private _io: Server) {
    this._setHandler();
  }

  private _setHandler() {
    this._socket.on("register_user", ({ userId }) => {
      chatHandler.handleConnect(userId);
      this._io.emit("user-status-changed", {
        userId,
        isOnline: true,
      });
    });

    this._socket.on("join_room", ({ roomId }) => {
      console.log('🚪 User joining room:', roomId, 'Socket ID:', this._socket.id);
      this._socket?.join(roomId);
    });

    this._socket.on("send_message", async (data, ack) => {
      console.log('📤 send_message event received:', {
        chatId: data.chatId,
        senderId: data.senderId,
        messageContent: data.messageContent?.substring(0, 50)
      });

      const id = await chatHandler.handleSendMessage(data);
      ack(id);

      console.log('📡 Broadcasting to room:', data.chatId, 'with message ID:', id);
      this._io.to(data.chatId).emit("receive-message", { ...data, _id: id });
      console.log('✅ Message broadcasted to room:', data.chatId);
    });
  }
}
