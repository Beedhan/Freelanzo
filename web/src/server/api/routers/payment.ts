import { TRPCError } from "@trpc/server";
import _stripe from "stripe";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { HOST_URL } from "~/utils/lib";

const stripe = new _stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});
export const paymentRouter = createTRPCRouter({
  upgrade: protectedProcedure.mutation(async () => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: "price_1NLq7nKb7gMwgquUZelDJZIG",
          quantity: 1,
        },
      ],
      success_url: `${HOST_URL}/subscription/success`,
      cancel_url: `${HOST_URL}/subscription/cancel`,
    });
    return {
      url: session.url,
    };
  }),
});
