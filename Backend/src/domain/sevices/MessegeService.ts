export interface MessageService {
  sendEmail(email: string, message: string): Promise<void>;
}
