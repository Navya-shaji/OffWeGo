export type Roles = "user" | "vendor" ; 
export interface ChatDto {
  id?: string;
  senderId: string;
  receiverId: string;
  senderRole: Roles;     
  receiverRole: Roles;
  message: string;
  createdAt?: Date;
}
