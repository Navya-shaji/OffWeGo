// import { ChatSocketIOAdapter } from "../../../adapters/socket/ChatSocketIOAdapter";
import { ChatRepository } from "../../../adapters/repository/Chat/chatRepository";
import { GetChatsOfUserUsecase } from "../../../useCases/chat/GetChatUSecase";
// import { EnableChatUsecase } from "../../../useCases/chat/IsbookingExistUsecas";
import { InitiateChatUsecase } from "../../../useCases/chat/SendChatUSecase";
// import { UpdateLastMessageUseCase } from "../../../useCases/chat/UpdateLastMEssageUsecase";
import { ChatController } from "../../../adapters/controller/chat/ChatController";
// import { BookingRepository } from "../../../adapters/repository/Booking/BookingRepository";
import { MessageController } from "../../../adapters/controller/chat/MessageController";
import { MessageRepository } from "../../../adapters/repository/Msg/MessageRepository"; 
import { CreateMessageUseCase } from "../../../useCases/msg/createMessageUsecase";
import { GetMessagesUsecase } from "../../../useCases/msg/getMessageUsecase";
import { LoadPreviousChatUseCase } from "../../../useCases/msg/loadPreviousmessageusecase";
import { ChatHandler } from "../../../adapters/socket/chatHandler";


const chatRepo=new ChatRepository()
// const bookingRepo=new BookingRepository()
const messegeRepo=new MessageRepository()


const getchatusecase=new GetChatsOfUserUsecase(chatRepo)
const createchat=new InitiateChatUsecase(chatRepo)
// const enableChat=new EnableChatUsecase(bookingRepo)
const createmsg=new CreateMessageUseCase(messegeRepo)
const getmsg=new GetMessagesUsecase(messegeRepo)
const loadchats=new LoadPreviousChatUseCase(messegeRepo)
// const updatemessage=new UpdateLastMessageUseCase(chatRepo)


export const chatHandler = new ChatHandler(createmsg)
export const chatcontroller=new ChatController(createchat,getchatusecase,)
export const msgcontroller=new MessageController(messegeRepo,getmsg,loadchats)
