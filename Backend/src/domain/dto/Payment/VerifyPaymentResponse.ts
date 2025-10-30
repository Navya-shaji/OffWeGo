export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data?: {
    bookingId: string;
    paymentStatus: string;
  };
}