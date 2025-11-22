import { IMessage } from "../../domain/entities/MessageEntity"
import { IInitiateChatUsecase } from "../../domain/interface/Chat/IsendChatUsecase"
import { IUpdateLastMessageUseCase } from "../../domain/interface/Chat/IUpdateLastMessageUSecase"
import { IUserRepository } from "../../domain/interface/UserRepository/IuserRepository"
import { getSocketIoServer, SocketIoServer } from "../../Io"

export class ChatSocketIOAdapter {
  private socketIoServer: SocketIoServer

  constructor(
    private createMessage: IInitiateChatUsecase,
    private updateLastMessageUseCase: IUpdateLastMessageUseCase,
    private userRepository: IUserRepository
  ) {
    this.socketIoServer = getSocketIoServer()
    this.setSocketIo()
  }

  private setSocketIo() {
    this.socketIoServer.getIO().on("connect", (socket) => {
      console.log(socket.id, "socket connected")
      socket.emit("connected", socket.id)

      console.log(this.socketIoServer.ChatOnline)

      socket.on("join-room", (data) => {
        console.log("User joined room:", data.roomId)
        socket.join(data.roomId)
        this.socketIoServer.ChatOnline.set(data.userId, data.roomId)
      })

      socket.on("leave-room", (data) => {
        console.log("User left room:", data.roomId)
        socket.leave(data.roomId)
        this.socketIoServer.ChatOnline.delete(data.userId)
      })

      socket.on("send-message", async (data) => {
        try {
          const message: IMessage = {
            chatId: data.chatId,
            messageContent: data.messageContent,
            senderId: data.senderId,
            senderModel: data.senderModel,
            seen: data.seen,
            sendedTime: data.sendedTime,
          }

          const result = await this.createMessage.initiateChat(message)
          await this.updateLastMessageUseCase.updateLastMessage(result)

          const sortedIds = [data.senderId, data.receiverId].sort()
          const roomId = sortedIds[0] + sortedIds[1]

          console.log("Emitting to room:", roomId)
          socket.to(roomId).emit("recive-message", result)
        } catch (error) {
          console.error("Error sending message:", error)
          socket.emit("err", "Failed to send message")
        }
      })

      socket.on("typing", (data) => {
        socket.to(data.roomId).emit("typing")
      })

      socket.on("stop-typing", (data) => {
        socket.to(data.roomId).emit("stop-typing")
      })
    })
  }
}