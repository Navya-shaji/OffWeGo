import { Request, Response } from "express";
import { IInitiateChatUsecase } from "../../../domain/interface/Chat/IsendChatUsecase";
import { IGetChatsOfUserUsecase } from "../../../domain/interface/Chat/IGetChatUSecase";
// import { IEnableChatUsecase } from "../../../domain/interface/Chat/IEnableChatUSecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";


export class ChatController {

    constructor(
        private _CreateChatUsecase: IInitiateChatUsecase,
        private _getChatUsecase: IGetChatsOfUserUsecase,
        // private _enableChatUsecase: IEnableChatUsecase
    ) { }


    async findOrCreateChat(req: Request, res: Response): Promise<void> {
        try {
            const { userId, ownerId } = req.body;
            console.log("ChatController: findOrCreateChat called with:", { userId, ownerId });

            if (!userId || !ownerId) {
                console.error("ChatController: Missing required fields");
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Missing required fields"
                });
                return;
            }

            const chat = await this._CreateChatUsecase.initiateChat({ userId, ownerId });
            console.log("ChatController: Chat created/found:", chat);

            res.status(HttpStatus.OK).json({
                success: true,
                data: chat
            });

        } catch (error) {
            console.error("Error finding/creating chat:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to find or create chat"
            });
        }
    }


    async getChatsOfUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;

            const result = await this._getChatUsecase.getChats(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: result
            });

        } catch (error) {
            console.error("Error getting user chats:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to get chats"
            });
        }
    }


    // async enableChat(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { userId, ownerId } = req.body;

    //         if (!userId || !ownerId) {
    //             res.status(HttpStatus.BAD_REQUEST).json({
    //                 success: false,
    //                 message: "Missing required fields: userId and ownerId"
    //             });
    //             return;
    //         }

    //         const result = await this._enableChatUsecase.IsBookingExists(userId, ownerId);

    //         res.status(HttpStatus.OK).json({
    //             success: true,
    //             data: result
    //         });

    //     } catch (error) {
    //         console.error("Error checking chat eligibility:", error);
    //         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //             success: false,
    //             message: "Failed to check chat eligibility"
    //         });
    //     }
    // }
}
