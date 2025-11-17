export interface ChatMessage {
  _id?: string;
  senderId: string;       
  receiverId: string;    
  senderRole: "user" | "vendor";
  receiverRole: "user" | "vendor";
  message: string;
  createdAt?: Date;
}
