export interface CreateCheckoutSessionDTO {
  vendorId: string;
  planId: string;
  planName: string;
  amount: number;
  date: string;
  time: string;
  domainUrl: string;
}