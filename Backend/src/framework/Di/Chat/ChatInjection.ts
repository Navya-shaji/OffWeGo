import { ChatRepository } from "../../../adapters/repository/Chat/ChatRepository";
import { GetChatsOfUserUsecase } from "../../../useCases/Chat/GetChatUSecase";
import { InitiateChatUsecase } from "../../../useCases/Chat/SendChatUSecase";
import { ChatController } from "../../../adapters/controller/chat/ChatController";
import { BookingRepository } from "../../../adapters/repository/Booking/BookingRepository";
import { MessageRepository } from "../../../adapters/repository/Msg/MessageRepository";
import { CreateMessageUseCase } from "../../../useCases/Msg/createMessageUsecase";
import { GetMessagesUseCase } from "../../../useCases/Msg/getMessageUsecase";
import { ChatHandler } from "../../../adapters/socket/chatHandler";
import { FirebaseNotificationService } from "../../Services/FirebaseNotificationService";
import { NotificationRepository } from "../../../adapters/repository/Notification/NotificationRepo";
import { UserRepository } from "../../../adapters/repository/User/UserRepository";
import { VendorRepository } from "../../../adapters/repository/Vendor/VendorRepository";
import { MarkMessagesSeenUseCase } from "../../../useCases/Chat/MarkMessageusecase";
const chatRepo = new ChatRepository();
const bookingRepo = new BookingRepository();
const messegeRepo = new MessageRepository();
const notificationRepo = new NotificationRepository();
const userRepo = new UserRepository();
const vendorRepo = new VendorRepository();

const getchatusecase = new GetChatsOfUserUsecase(chatRepo);
const createchat = new InitiateChatUsecase(chatRepo, bookingRepo);
const createmsg = new CreateMessageUseCase(messegeRepo);
const getmsg = new GetMessagesUseCase(messegeRepo);
const markMessagesSeenUseCase = new MarkMessagesSeenUseCase(messegeRepo, chatRepo);

const notificationService = new FirebaseNotificationService(notificationRepo, userRepo, vendorRepo);

export const chatHandler = new ChatHandler(createmsg, chatRepo, notificationService, messegeRepo);
export const chatcontroller = new ChatController(createchat, getchatusecase, getmsg, markMessagesSeenUseCase);

