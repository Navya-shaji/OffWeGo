import { Server, Socket } from "socket.io";
import { Server as httpServer } from "http";

export class SocketIoServer {
  private io: Server;
  public userSockets = new Map<string, Socket>();
  public ChatOnline = new Map<string, string>();

  constructor(server: Server) {
    this.io = server;
    this.setupSocket();
  }

  public getIO(): Server {
    return this.io;
  }

  private setupSocket() {
    this.io.on("connection", (socket: Socket) => {
      console.log(socket.id, "socket connected");

      socket.emit("connected", socket.id);


      socket.on("user-online", (userId: string) => {
        this.userSockets.set(userId, socket);
        socket.broadcast.emit("user-status-changed", {
          userId,
          isOnline: true,
        });
      });


      socket.on("disconnect", () => {
        this.userSockets.forEach((userSocket, userId) => {
          if (userSocket.id === socket.id) {
            this.userSockets.delete(userId);

            socket.broadcast.emit("user-status-changed", {
              userId,
              isOnline: false,
            });
          }
        });
      });
    });
  }
}

let socketIOServer: SocketIoServer;

// Create Socket.IO server instance
export const createSocketIOServer = (server: httpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      credentials: true,
    },
  });

  socketIOServer = new SocketIoServer(io);
  return socketIOServer;
};

// Get the same Socket.IO instance everywhere
export const getSocketIoServer = () => {
  if (!socketIOServer) {
    throw new Error("IO not found");
  }
  return socketIOServer;
};
