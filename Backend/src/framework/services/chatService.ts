import { Server } from "socket.io";
import { ChatRepository } from "../../adapters/repository/Chat/chatRepository"; 

export class SocketService {
  private io: Server;
  private chatRepo: ChatRepository;

  constructor(io: Server) {
    this.io = io;
    this.chatRepo = new ChatRepository();
  }

  initialize() {
    this.io.on("connection", (socket) => {
      console.log(` ${socket.id} connected`);

      socket.on("joinRoom", (roomId: string) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
      });

      socket.on("sendMessage", async (data) => {
        const message = await this.chatRepo.save(data);
        this.io.to(data.roomId).emit("receiveMessage", message);
      });

      socket.on("disconnect", () => {
        console.log(` ${socket.id} disconnected`);
      });
    });
  }
}
