export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string; 
}
