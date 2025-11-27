import { Request, Response } from "express";
import { IMessageRepository } from "../../../domain/interface/Msg/IMessageRepo";
import { IGetMessagesUsecase } from "../../../domain/interface/Msg/IGetMsgUsecase";
import { ILoadPreviousChatUseCase } from "../../../domain/interface/Msg/ILoadMsgUSecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";


export class MessageController {
    private _messageRepository: IMessageRepository;
    private _getMessagesUsecase: IGetMessagesUsecase;
    private _loadPreviousChatUseCase: ILoadPreviousChatUseCase;

    constructor(
        messageRepository: IMessageRepository,
        getMessagesUsecase: IGetMessagesUsecase,
        loadPreviousChatUseCase: ILoadPreviousChatUseCase
    ) {
        this._messageRepository = messageRepository;
        this._getMessagesUsecase = getMessagesUsecase;
        this._loadPreviousChatUseCase = loadPreviousChatUseCase;
    }


    async getMessagesByChatId(req: Request, res: Response): Promise<void> {
        try {
            const { chatId } = req.params;

            if (!chatId) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Chat ID is required",
                });
                return;
            }

            const result = await this._getMessagesUsecase.execute(chatId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("Error getting messages:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to get messages",
            });
        }
    }

    // Mark single message as seen
    async markMessageAsSeen(req: Request, res: Response): Promise<void> {
        try {
            const { messageId } = req.params;

            if (!messageId) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Message ID is required",
                });
                return;
            }

            const result = await this._messageRepository.markMessageAsSeen(messageId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("Error marking message as seen:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to mark message as seen",
            });
        }
    }

    // Mark all messages in a chat as seen
    async markAllMessagesAsSeenInChat(req: Request, res: Response): Promise<void> {
        try {
            const { chatId } = req.params;

            if (!chatId) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Chat ID is required",
                });
                return;
            }

            const result = await this._messageRepository.markAllMessagesAsSeenInChat(chatId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("Error marking all messages as seen:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to mark all messages as seen",
            });
        }
    }

    // Load previous messages with pagination (or full chat)
    async loadPreviousMessages(req: Request, res: Response): Promise<void> {
        try {
            const pageNo = req.query.pageNo as string;
            const chatId = req.query.chatId as string;

            if (!pageNo || !chatId) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    error: "pageNo or chatId is not provided",
                });
                return;
            }

            const { messages } = await this._loadPreviousChatUseCase.loadPreviousChat(chatId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Previous chat loaded",
                messages,
            });
        } catch (error) {
            console.error("Error while loading previous messages:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error while loading previous messages",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
