import { IChat, IChatPopulated } from "../../../domain/entities/chatEntity";
import { IMessage } from "../../../domain/entities/MessageEntity";
import { IChatRepository } from "../../../domain/interface/Chat/IchatRepo";
import { chatModel } from "../../../framework/database/Models/chatModel";

import mongoose from "mongoose";

export class ChatRepository implements IChatRepository {
  async createChat(chat: IChat): Promise<IChatPopulated> {
    console.log('💾 Creating chat with data:', chat);

    // Validate that we have both userId and vendorId
    if (!chat.userId || !chat.vendorId) {
      console.error('❌ Cannot create chat: missing userId or vendorId', chat);
      throw new Error('Both userId and vendorId are required to create a chat');
    }

    const createdChat = await chatModel.create(chat);
    console.log('✅ Chat created with ID:', createdChat._id);
    console.log('📝 Raw chat document:', {
      _id: createdChat._id,
      userId: createdChat.userId,
      vendorId: createdChat.vendorId
    });

    const populatedChat = await chatModel.findById(createdChat._id)
      .populate({
        path: 'userId',
        select: 'name imageUrl'
      })
      .populate({
        path: 'vendorId',
        select: 'name profileImage'
      }) as unknown as IChatPopulated;

    console.log('📦 Returning populated chat:', {
      _id: populatedChat._id,
      userId: populatedChat.userId,
      vendorId: populatedChat.vendorId
    });

    return populatedChat;
  }

  async getchatOfUser(userId: string, ownerId: string): Promise<IChatPopulated | null> {
    const uId = userId.toString();
    const oId = ownerId.toString();

    console.log('🔍 getchatOfUser called with (stringified):', { uId, oId });

    // Validate IDs before casting to avoid crashes
    if (!mongoose.Types.ObjectId.isValid(uId) || !mongoose.Types.ObjectId.isValid(oId)) {
      console.warn("⚠️ Invalid ObjectId format detected:", { uId, oId });
      return null;
    }

    const userObjectId = new mongoose.Types.ObjectId(uId);
    const ownerObjectId = new mongoose.Types.ObjectId(oId);

    const chat = await chatModel.findOne({
      $and: [
        {
          $or: [
            { userId: userObjectId, vendorId: ownerObjectId },
            { userId: ownerObjectId, vendorId: userObjectId },
            // Fallback for potential string-stored IDs or casting weirdness
            { userId: uId, vendorId: oId },
            { userId: oId, vendorId: uId }
          ]
        },
        // Exclude chats with null userId or vendorId
        { userId: { $ne: null } },
        { vendorId: { $ne: null } }
      ]
    })
      .populate({
        path: 'userId',
        select: 'name imageUrl'
      })
      .populate({
        path: 'vendorId',
        select: 'name profileImage'
      });

    console.log('📦 Chat found:', chat ? chat._id : 'null');
    return chat as unknown as IChatPopulated;
  }


  async findChatsOfUser(userId: string): Promise<{ chats: IChatPopulated[] | null; }> {
    const chats = await chatModel.find({
      $and: [
        {
          $or: [
            { userId },
            { vendorId: userId }
          ]
        },
        // Exclude corrupted chats
        { userId: { $ne: null } },
        { vendorId: { $ne: null } }
      ]
    })
      .sort({ lastMessageAt: -1 })
      .populate('userId', 'name imageUrl')
      .populate('vendorId', 'name profileImage');

    return { chats: chats as unknown as IChatPopulated[] };
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

  async deleteChat(chatId: string): Promise<void> {
    await chatModel.findByIdAndDelete(chatId);
    console.log('✅ Deleted chat:', chatId);
  }
}