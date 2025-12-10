import { ChatRepository } from "../../../adapters/repository/Chat/chatRepository";
import { GetChatsOfUserUsecase } from "../../../useCases/chat/GetChatUSecase";
import { InitiateChatUsecase } from "../../../useCases/chat/SendChatUSecase";
import { ChatController } from "../../../adapters/controller/chat/ChatController";
import { MessageRepository } from "../../../adapters/repository/Msg/MessageRepository";
import { CreateMessageUseCase } from "../../../useCases/msg/createMessageUsecase";
import { ChatHandler } from "../../../adapters/socket/chatHandler";
import { FirebaseNotificationService } from "../../Services/FirebaseNotificationService";
import { NotificationRepository } from "../../../adapters/repository/Notification/NotificationRepo";
import { UserRepository } from "../../../adapters/repository/User/UserRepository";
import { VendorRepository } from "../../../adapters/repository/Vendor/VendorRepository";
import { GetMessagesUseCase } from "../../../useCases/msg/getMessageUsecase";
import { MarkMessagesSeenUseCase } from "../../../useCases/chat/MarkMessageusecase";

const chatRepo = new ChatRepository();
const messegeRepo = new MessageRepository();
const notificationRepo = new NotificationRepository();
const userRepo = new UserRepository();
const vendorRepo = new VendorRepository();

const getchatusecase = new GetChatsOfUserUsecase(chatRepo);
const createchat = new InitiateChatUsecase(chatRepo);
const createmsg = new CreateMessageUseCase(messegeRepo);
const getmsg = new GetMessagesUseCase(messegeRepo);
const markMessagesSeenUseCase = new MarkMessagesSeenUseCase(messegeRepo);

const notificationService = new FirebaseNotificationService(notificationRepo, userRepo, vendorRepo);

export const chatHandler = new ChatHandler(createmsg, chatRepo, notificationService);
export const chatcontroller = new ChatController(createchat, getchatusecase, getmsg, markMessagesSeenUseCase);

