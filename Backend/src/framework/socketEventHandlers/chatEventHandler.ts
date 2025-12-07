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
      console.log("room joined");
      this._socket?.join(roomId);
    });

    this._socket.on("send_message", async (data, ack) => {
      const id = await chatHandler.handleSendMessage(data);
      ack(id);
    });
  }
}
