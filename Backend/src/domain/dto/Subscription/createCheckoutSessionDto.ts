export interface CreateCheckoutSessionDTO {
  vendorId: string;
  planId: string;
  planName: string;
  amount: number;
  duration: number;          
  features?: string[];       
  domainUrl: string;          
}
