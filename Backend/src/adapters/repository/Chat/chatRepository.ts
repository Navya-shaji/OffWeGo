import { chatModel } from "../../../framework/database/Models/chatModel";
import { IChat } from "../../../domain/entities/chatEntity";
import { IChatRepository } from "../../../domain/interface/Chat/IchatRepo";

export class ChatRepository implements IChatRepository {

    async findChat(members: string[]): Promise<IChat | null> {
        if (members.length !== 2) return null;
        return await this.getchatOfUser(members[0], members[1]);
    }

    async createChat(data: IChat): Promise<any> {
        console.log("💾 Creating chat with data:", data);

        if (!data.userId || !data.vendorId) {
            console.error("❌ Cannot create chat: missing userId or vendorId", data);
            throw new Error("Both userId and vendorId are required to create a chat");
        }

        const createdChat = await chatModel.create(data);
        console.log("✅ Chat created with ID:", createdChat._id);

        const populatedChat = await chatModel
            .findById(createdChat._id)
            .populate({ path: "userId", select: "name imageUrl" })
            .populate({ path: "vendorId", select: "name profileImage" });

        return populatedChat;
    }

    async findChatById(chatId: string): Promise<IChat | null> {
        return await chatModel.findById(chatId);
    }

    async findChatByUserId(userId: string): Promise<IChat[]> {
        return await chatModel
            .find({
                $or: [{ userId: userId }, { vendorId: userId }],
            })
            .sort({ updatedAt: -1 });
    }

    async findChatsOfUser(userId: string): Promise<{ chats: any[] }> {
        const chats = await chatModel
            .find({
                $and: [
                    { $or: [{ userId: userId }, { vendorId: userId }] },
                    { userId: { $ne: null } },
                    { vendorId: { $ne: null } },
                ],
            })
            .sort({ lastMessageAt: -1 })
            .populate("userId", "name imageUrl")
            .populate("vendorId", "name profileImage")
            .lean();

        return { chats };
    }

    async getchatOfUser(userId: string, ownerId: string): Promise<any> {
        const chat = await chatModel
            .findOne({
                $and: [
                    {
                        $or: [
                            { userId: userId, vendorId: ownerId },
                            { userId: ownerId, vendorId: userId },
                        ],
                    },
                    { userId: { $ne: null } },
                    { vendorId: { $ne: null } },
                ],
            })
            .populate({ path: "userId", select: "name imageUrl" })
            .populate({ path: "vendorId", select: "name profileImage" });

        return chat;
    }

    async updateLastMessage(chatId: string, message: string, time: Date) {
        return await chatModel.findByIdAndUpdate(chatId, {
            lastMessage: message,
            lastMessageAt: time,
        });
    }

    async incrementUnreadCount(
        chatId: string,
        recipientType: "user" | "vendor"
    ): Promise<void> {
        const updateField =
            recipientType === "user" ? "unreadCountUser" : "unreadCountVendor";

        await chatModel.findByIdAndUpdate(chatId, {
            $inc: { [updateField]: 1 },
        });
    }
}
