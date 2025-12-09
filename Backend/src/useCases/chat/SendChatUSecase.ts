import { IChatOut, ICreateChatDto } from "../../domain/dto/Chat/chatDto";
import { IChat } from "../../domain/entities/chatEntity";
import { IChatRepository } from "../../domain/interface/Chat/IchatRepo";
import { IInitiateChatUsecase } from "../../domain/interface/Chat/IsendChatUsecase";

import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";

export class InitiateChatUsecase implements IInitiateChatUsecase {
  private chatRepository: IChatRepository;
  private bookingRepository: IBookingRepository;

  constructor(chatRepository: IChatRepository, bookingRepository: IBookingRepository) {
    this.chatRepository = chatRepository;
    this.bookingRepository = bookingRepository;
  }

  async initiateChat(input: ICreateChatDto): Promise<IChatOut> {
    const { userId: initiatorId, ownerId: otherPersonId } = input;

    if (!initiatorId || !otherPersonId) {
      throw new Error(
        "Both userId and ownerId are required to initiate a chat."
      );
    }
let chat
    // 1. Try to find an existing chat
    console.log(`[InitiateChat] Searching for chat between: ${initiatorId} and ${otherPersonId}`);
    try {
        chat = await this.chatRepository.getchatOfUser(initiatorId, otherPersonId);
      console.log(`[InitiateChat] Found chat: ${chat ? chat._id : 'null'}`);
    } catch (err) {
      console.error(`[InitiateChat] Error finding chat:`, err);
      chat = null;
    }

    // 2. Check if chat is corrupted (userId or vendorId is null)
    if (chat && (!chat.userId || !chat.vendorId)) {
      console.warn('🗑️ Found corrupted chat, deleting it:', chat._id);
      await this.chatRepository.deleteChat(chat._id as string);
      chat = null;
    }

    // 3. If chat does NOT exist, enforce booking prerequisite before creating
    if (!chat) {
      const hasBooking = await this.bookingRepository.checkBookingExistsBetweenUserAndOwner(
        initiatorId,
        otherPersonId
      );

      // If no booking found, try swapping IDs just in case
      const hasBookingSwap = !hasBooking
        ? await this.bookingRepository.checkBookingExistsBetweenUserAndOwner(
          otherPersonId,
          initiatorId
        )
        : null;

      if (!hasBooking && !hasBookingSwap) {
        throw new Error("Chat is only allowed after a confirmed booking.");
      }

      // We need to determine which ID is the user and which is the vendor
      // Check both collections to assign correctly
      const { UserModel } = await import('../../framework/database/Models/userModel');
      const { VendorModel } = await import('../../framework/database/Models/vendorModel');

      const initiatorAsUser = await UserModel.findById(initiatorId);
      const initiatorAsVendor = await VendorModel.findById(initiatorId);
      const otherAsUser = await UserModel.findById(otherPersonId);
      const otherAsVendor = await VendorModel.findById(otherPersonId);

      let actualUserId: string;
      let actualVendorId: string;

      // Determine the correct userId and vendorId
      if (initiatorAsUser && otherAsVendor) {
        // Initiator is User, Other is Vendor
        actualUserId = initiatorId;
        actualVendorId = otherPersonId;
      } else if (initiatorAsVendor && otherAsUser) {
        // Initiator is Vendor, Other is User
        actualUserId = otherPersonId;
        actualVendorId = initiatorId;
      } else {
        // Provide detailed error message
        let errorMsg = 'Could not create chat. ';

        if (!initiatorAsUser && !initiatorAsVendor) {
          errorMsg += `Initiator (${initiatorId}) not found in User or Vendor collections. `;
        }
        if (!otherAsUser && !otherAsVendor) {
          errorMsg += `Other participant (${otherPersonId}) not found in User or Vendor collections. `;
        }
        if ((initiatorAsUser && otherAsUser) || (initiatorAsVendor && otherAsVendor)) {
          errorMsg += 'Both participants cannot be the same type (both users or both vendors). ';
        }

        console.error('❌ Could not determine user/vendor roles:', {
          initiatorId,
          otherPersonId,
          initiatorAsUser: !!initiatorAsUser,
          initiatorAsVendor: !!initiatorAsVendor,
          otherAsUser: !!otherAsUser,
          otherAsVendor: !!otherAsVendor,
          error: errorMsg
        });
        throw new Error(errorMsg + 'Please ensure the vendor is approved and exists in the database.');
      }

      const newChat: IChat = {
        userId: actualUserId,
        vendorId: actualVendorId,
        lastMessage: "",
        lastMessageAt: new Date(),
      };

      chat = await this.chatRepository.createChat(newChat);
      if (!chat) throw new Error("Error while creating new chat");
    }

    // Determine other user correctly
    // The input 'initiatorId' is the one initiating the request (could be User or Vendor)
    // We need to find which field in the chat document corresponds to the OTHER person.

    let otherUser;

    // Check if chat.userId matches the request initiator
    if (chat.userId && (chat.userId as any)._id?.toString() === initiatorId.toString()) {
      otherUser = chat.vendorId;
    }
    // Check if chat.vendorId matches the request initiator
    else if (chat.vendorId && (chat.vendorId as any)._id?.toString() === initiatorId.toString()) {
      otherUser = chat.userId;
    }
    // Fallback: If the request initiator is the 'otherPersonId' (e.g. vendor initiating chat with user)
    else if (chat.userId && (chat.userId as any)._id?.toString() === otherPersonId.toString()) {
      otherUser = chat.vendorId;
    }
    else if (chat.vendorId && (chat.vendorId as any)._id?.toString() === otherPersonId.toString()) {
      otherUser = chat.userId;
    }

    if (!otherUser) {
      console.error("InitiateChatUsecase: Failed to identify other user", {
        inputUserId: initiatorId,
        inputOwnerId: otherPersonId,
        chatUserId: (chat.userId as any)?._id,
        chatVendorId: (chat.vendorId as any)?._id
      });
      throw new Error("Other user data is missing in the chat.");
    }

    // Extract image based on whether it's a vendor (profileImage) or user (imageUrl)
    const profileImage = 'profileImage' in otherUser
      ? (otherUser as any).profileImage
      : (otherUser as any).imageUrl || "";

    // Ensure chat is a plain object to preserve all fields including userId/vendorId
    const chatObj = JSON.parse(JSON.stringify(chat));

    return {
      ...chatObj,
      _id: chat._id,
      name: otherUser.name || "Unknown",
      profile_image: profileImage,
      isOnline: true,
      lastMessage: chat.lastMessage || "",
      lastMessageAt: chat.lastMessageAt || new Date(),
    } as any;
  }
}
