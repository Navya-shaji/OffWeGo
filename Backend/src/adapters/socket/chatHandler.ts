import { IMessageOut } from "../../domain/dto/Chat/MessageDto";
import { ICreateMessageUsecase } from "../../domain/interface/Msg/IcreateMsgUsecase";

export class ChatHandler {
  constructor(private _sendMessageUseCase: ICreateMessageUsecase) { }

  handleConnect(userId: string) {
    console.log("user connected", userId)
  }

  async handleSendMessage(data: IMessageOut): Promise<string> {
    console.log('📨 handleSendMessage called with:', {
      chatId: data.chatId,
      senderId: data.senderId,
      senderType: data.senderType,
      messageContent: data.messageContent?.substring(0, 50)
    });

    const message = await this._sendMessageUseCase.createMessage({
      chatId: data.chatId,
      messageContent: data.messageContent,
      seen: data.seen,
      sendedTime: data.sendedTime,
      senderId: data.senderId,
      senderType: data.senderType,
      receiverId: data.receiverId,
    });

    console.log('✅ Message saved with ID:', message._id);
    return message._id || "";
  }
}
