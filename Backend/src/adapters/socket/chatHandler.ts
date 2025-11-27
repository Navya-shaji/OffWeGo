import { IMessageOut } from "../../domain/dto/Chat/MessageDto";
import { ICreateMessageUsecase } from "../../domain/interface/Msg/IcreateMsgUsecase";

export class ChatHandler {
  constructor(private _sendMessageUseCase: ICreateMessageUsecase) {}

  handleConnect(userId: string) {
    console.log("user connected", userId)
  }

  async handleSendMessage(data: IMessageOut): Promise<string> {
    const message = await this._sendMessageUseCase.createMessage({
      chatId: data.chatId,
      messageContent: data.messageContent,
      seen: data.seen,
      sendedTime: data.sendedTime,
      senderId: data.senderId,
      senderType: data.senderType,
    });

    return message._id!;
  }
}
