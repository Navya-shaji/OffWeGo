import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ISendChatMessageUseCase } from "../../../domain/interface/Chat/IsendChatUsecase";
import { IChatUseCase } from "../../../domain/interface/Chat/IGetChatUSecase";
import { ChatDto } from "../../../domain/dto/Chat/chatDto";

export class ChatController {
  constructor(
    private _sendChat: ISendChatMessageUseCase,
    private _getChat: IChatUseCase
  ) {}

  async sendChat(req: Request, res: Response): Promise<void> {
    try {
      const chatDto: ChatDto = req.body;

      const savedMessage = await this._sendChat.execute(chatDto);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Message sent successfully",
        data: savedMessage,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to send message",
        error: (error as Error).message,
      });
    }
  }

  async getChat(req: Request, res: Response): Promise<void> {
    try {
      const { senderId } = req.params;
      const chatMessages = await this._getChat.execute(senderId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Chat messages retrieved successfully",
        data: chatMessages,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to retrieve chat messages",
        error: (error as Error).message,
      });
    }
  }
}
