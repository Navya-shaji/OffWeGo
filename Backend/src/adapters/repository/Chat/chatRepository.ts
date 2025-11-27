import { IChat, IChatPopulated } from "../../../domain/entities/chatEntity";
import { IMessage } from "../../../domain/entities/MessageEntity";
import { IChatRepository } from "../../../domain/interface/Chat/IchatRepo";
import { chatModel } from "../../../framework/database/Models/chatModel";


export class ChatRepository implements IChatRepository {
  async createChat(chat: IChat): Promise<IChatPopulated> {
    const createdChat = await chatModel.create(chat);
    return await chatModel.findById(createdChat._id)
      .populate({
        path: 'userId',
        select: 'name profile_image'
      })
      .populate({
        path: 'vendorId',
        select: 'name profile_image'
      }) as unknown as IChatPopulated;
  }

async getchatOfUser(userId: string, ownerId: string): Promise<IChatPopulated | null> {
    const chat = await chatModel.findOne({
        $or: [
            {  userId, vendorId: ownerId },
            { userId: ownerId, vendorId: userId }
        ]
    })
    .populate("userId")
    .populate("vendorId");

    return chat as unknown as IChatPopulated;
}


  async findChatsOfUser(userId:string): Promise<{chats:IChatPopulated[]|null}> {
    const result = await chatModel.findOne({
    userId
    })
    .sort({ lastMessageAt: -1 })
    .populate('userId', 'name profile_image')
    .populate('vendorId', 'name profile_image');
    
    const chats = result as unknown as IChatPopulated[];
    return { chats }
  }

  async updateLastMessage(message: IMessage): Promise<IChat | null> {
    console.log(message)
    return await chatModel.findByIdAndUpdate(
      message.chatId,
      {
        lastMessage: message.messageContent,
        lastMessageAt: message.sendedTime
      },
      { new: true }
    );
  }
}