import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IInitiateChatUsecase } from "../../../domain/interface/Chat/IsendChatUsecase";
import { IGetMessagesUsecase } from "../../../domain/interface/Msg/IGetMsgUsecase";
import { IMarkMessagesSeenUseCase } from "../../../domain/interface/Chat/IMarkMesgusecase";
import { GetChatsOfUserUsecase } from "../../../useCases/chat/GetChatUSecase";

export class ChatController {
  constructor(
    private _initiateChatUsecase: IInitiateChatUsecase,
    private _getChatsUsecase: GetChatsOfUserUsecase,
    private _getMessagesUsecase: IGetMessagesUsecase,
    private _markMessagesSeenUseCase: IMarkMessagesSeenUseCase
  ) {}

  async findOrCreateChat(req: Request, res: Response) {
    try {
      const { userId, ownerId } = req.body;

      const chat = await this._initiateChatUsecase.initiateChat({
        userId,
        ownerId,
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        data: chat,
      });
    } catch (error) {
      console.error("Error creating chat:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  async getChats(req: Request, res: Response) {
    try {
      const userId = req.params.userId || req.params.vendorId;

      const userType = (req.query.userType as "user" | "vendor") || "user";

      const chats = await this._getChatsUsecase.getChats(userId, userType);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: chats,
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
  
  async getMessages(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const messages = await this._getMessagesUsecase.execute(chatId);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  async markMessagesSeen(req: Request, res: Response) {
    try {
      const { chatId, userId } = req.body;
      await this._markMessagesSeenUseCase.execute(chatId, userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Messages marked as seen",
      });
    } catch (error) {
      console.error("Error marking messages as seen:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}
