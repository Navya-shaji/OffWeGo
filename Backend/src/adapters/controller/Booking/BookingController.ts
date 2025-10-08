import { ICreateBookingUseCase } from "../../../domain/interface/Booking/ICreateBookingUSecase";
import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";

export class BookingController {
  constructor(private _createBooking: ICreateBookingUseCase) {}

  async createBooking(req: Request, res: Response): Promise<void> {
    try {
          const {data,payment_id} = req.body;
    const result = await this._createBooking.execute({data,payment_id});
    console.log('console from controller',result)
    res.status(HttpStatus.CREATED).json({ success: true, booking: result });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({sucess:false,error})
    }

  }
//   async handleStripeWebhook(req: Request, res: Response) {
//     const sig = req.headers["stripe-signature"] as string;
//     let event: Stripe.Event;

//     try {
//       event = Stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET as string
//       );
//     } catch (err) {
//       return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
//     }

//     if (event.type === "payment_intent.succeeded") {
//       const paymentIntent = event.data.object as Stripe.PaymentIntent;

// const bookingData: CreateBookingDto = {
//   userId: paymentIntent.metadata.userId,
//   contactInfo: JSON.parse(paymentIntent.metadata.contactInfo),
//   adults: JSON.parse(paymentIntent.metadata.adults),
//   children: JSON.parse(paymentIntent.metadata.children),
//   selectedPackage: JSON.parse(paymentIntent.metadata.selectedPackage),
//   selectedDate: new Date(paymentIntent.metadata.selectedDate),
//   totalAmount: paymentIntent.amount / 100, // convert paise to INR
// };;

//       await this._createBooking.execute(bookingData);
//     }

//     res.status(200).json({ received: true });
//   }
}
