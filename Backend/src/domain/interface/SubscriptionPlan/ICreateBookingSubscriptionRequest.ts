export interface ICreateBookingSubscriptionRequest {
  vendorId: string;
  planId: string;
  date: string;
  time: string;
  domainUrl: string; 
}