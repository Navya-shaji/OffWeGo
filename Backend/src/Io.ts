import { Server as SocketIOServer } from "socket.io";
import http from "http";
import { ChatEventHandler } from "./framework/socketEventHandlers/chatEventHandler";

export class SocketIoServer {
    private userSockets: Map<string, any> = new Map();
    private ChatOnline: Map<string, boolean> = new Map();
    private io: SocketIOServer;

    constructor(server: SocketIOServer) {
        this.io = server;
        this.setupSocket();
    }

    getIO(): SocketIOServer {
        return this.io;
    }

    private setupSocket(): void {
        this.io.on("connection", (socket) => {
            console.log(socket.id, "socket connected");
            new ChatEventHandler(socket, this.io);
            socket.on("disconnect", () => {
                this.userSockets.forEach((userSocket, userId) => {
                    if (userSocket.id === socket.id) {
                        this.userSockets.delete(userId);
                        socket.broadcast.emit("user-status-changed", {
                            userId: userId,
                            isOnline: false,
                        });
                    }
                });
            });
        });
    }
}

let socketIOServer: SocketIoServer | null = null;

export const createSocketIOServer = (server: http.Server): SocketIoServer => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN?.split(',') || [
                "http://localhost:5173",
                "http://localhost:4173",
                "http://localhost:1212",
            ],
            credentials: true,
        },
    });
    socketIOServer = new SocketIoServer(io);
    return socketIOServer;
};


export const getSocketIoServer = (): SocketIoServer => {
    if (!socketIOServer) {
        throw new Error("IO not found");
    }
    return socketIOServer;
};

