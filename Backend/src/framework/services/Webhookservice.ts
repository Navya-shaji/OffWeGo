import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { subscriptionBookingModel } from "../database/Models/SubscriptionBookingModel"; 
import dotenv from "dotenv";
import * as QRCode from "qrcode";

dotenv.config();

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-09-30.clover",
});


router.post(
  "/stripe",
  require("express").raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: unknown) {
      return res.status(400).send(`Webhook Error ${err}`);
    }


    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const bookingId = session.metadata?.bookingId;

        if (bookingId) {

          await subscriptionBookingModel.updateOne(
            { _id: bookingId },
            {
              $set: {
                status: "active",
                updatedAt: new Date(),
              },
            }
          );

        }
        break;
      }

      case "invoice.payment_succeeded": {
        break;
      }
    }

    res.json({ received: true });
  }
);

export default router;
