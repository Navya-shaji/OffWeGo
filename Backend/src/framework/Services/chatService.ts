import { Server } from "socket.io";
import { ChatRepository } from "../../adapters/repository/Chat/ChatRepository";

export class SocketService {
  private io: Server;
  private chatRepo: ChatRepository;

  constructor(io: Server) {
    this.io = io;
    this.chatRepo = new ChatRepository();
  }

  initialize() {
    this.io.on("connection", (socket) => {


      socket.on("joinRoom", (roomId: string) => {
        socket.join(roomId);

      });

      socket.on("sendMessage", async (data) => {
        const message = await this.chatRepo.createChat(data);
        this.io.to(data.roomId).emit("receiveMessage", message);
      });

      socket.on("disconnect", () => {

      });
    });
  }
}
