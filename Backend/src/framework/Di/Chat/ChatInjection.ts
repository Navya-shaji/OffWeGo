// import { ChatSocketIOAdapter } from "../../../adapters/socket/ChatSocketIOAdapter";
import { ChatRepository } from "../../../adapters/repository/Chat/chatRepository";
import { GetChatsOfUserUsecase } from "../../../useCases/chat/GetChatUSecase";
import { EnableChatUsecase } from "../../../useCases/chat/IsbookingExistUsecas";
import { InitiateChatUsecase } from "../../../useCases/chat/SendChatUSecase";
// import { UpdateLastMessageUseCase } from "../../../useCases/chat/UpdateLastMEssageUsecase";
import { ChatController } from "../../../adapters/controller/chat/ChatController";
import { BookingRepository } from "../../../adapters/repository/Booking/BookingRepository";


const chatRepo=new ChatRepository()
const bookingRepo=new BookingRepository()

const getchatusecase=new GetChatsOfUserUsecase(chatRepo)
const createchat=new InitiateChatUsecase(chatRepo)
const enableChat=new EnableChatUsecase(bookingRepo)
// const updatemessage=new UpdateLastMessageUseCase(chatRepo)

export const chatcontroller=new ChatController(createchat,getchatusecase,enableChat)
