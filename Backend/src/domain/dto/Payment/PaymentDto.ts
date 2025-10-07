export interface PaymentDTO {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret:string
}
