import { Request, Response } from "express";
import { chatModel } from "../../../framework/database/Models/chatModel";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";

export class ChatCleanupController {
    /**
   * Delete all chat documents to reset the chat system
   */
    async cleanupCorruptedChats(req: Request, res: Response): Promise<void> {
        try {
            console.log('🧹 Starting cleanup of ALL chats...');

            // Delete ALL chats to start fresh
            const result = await chatModel.deleteMany({});

            console.log(`✅ Deleted ${result.deletedCount} chats`);

            res.status(HttpStatus.OK).json({
                success: true,
                message: `Successfully deleted ${result.deletedCount} chats. Chat system reset.`,
                deleted: result.deletedCount
            });
        } catch (error) {
            console.error('❌ Error cleaning up chats:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to cleanup chats',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
