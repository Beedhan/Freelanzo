import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { prisma } from "~/server/db";

export const config = {
  api: {
    bodyParser: false,
  },
};
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"] as string;
    if (!sig) return res.json({ received: false, error: "no sig" });
    const webhookSecret = process.env.WEBHOOK_SIGNING_SECRET;
    if (!webhookSecret)
      return res.json({ received: false, error: "no secret" });
    if (!process.env.STRIPE_SECRET_KEY) return res.status(500).end();
    let event: Stripe.Event;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15",
    });

    try {
      const body = await buffer(req);
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        "whsec_12c143d527d094f436c6bc778c6bf94ccc6842231a922dcbb53cdd67044b495d"
      );
    } catch (err) {
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err?.message}`);
      return;
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("PaymentIntent was successful!");
        const invoice = await prisma.invoice.update({
          where: {
            id: event.data.object.metadata?.invoiceId,
          },
          data: {
            status: "PAID",
          },
          select: {
            workspaceId: true,
            title: true,
            Client: {
              select: {
                name: true,
              },
            },
          },
        });
        if(invoice){
          await prisma.notification.create({
            data: {
              text: `Invoice ${invoice.title} is paid by ${invoice.Client.name}`,
              workspaceId: invoice.workspaceId,
              type:"INVOICE"
            },
          });
        }
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        console.log("PaymentMethod was attached to a Customer!");
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

const buffer = (req: NextApiRequest) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    req.on("error", reject);
  });
};

export default handler;
