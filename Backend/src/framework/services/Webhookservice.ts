import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { subscriptionPlanModel } from "../database/Models/subscriptionModel"; 
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-09-30.clover",
});


router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
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
      console.error("❌ Webhook Error:",err);
      return res.status(400).send(`Webhook Error ${err}`);
    }

    console.log("⚡ Webhook event received:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const bookingId = session.metadata?.bookingId;

        if (bookingId) {
          console.log("🔄 Updating subscription:", bookingId);

          await subscriptionPlanModel.updateOne(
            { _id: bookingId },
            {
              $set: {
                status: "active",
                updatedAt: new Date(),
              },
            }
          );

          console.log("✅ Subscription updated successfully");
        }
        break;
      }

      case "invoice.payment_succeeded": {
        console.log("💰 Invoice paid successfully");
        break;
      }
    }

    res.json({ received: true });
  }
);

export default router;
