import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import _stripe from "stripe";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const checkoutRouter = createTRPCRouter({
  setStripe: protectedProcedure
    .input(
      z.object({
        secret_key: z.string().regex(/^sk_test_/),
        public_key: z.string().regex(/^pk_test_/),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.isWorkspaceOwner)
        throw new TRPCError({
          message: "You are not a workspace owner",
          code: "UNAUTHORIZED",
        });
      const checkout = await ctx.prisma.checkout.findUnique({
        where: {
          workspaceId: ctx.session.user.workSpaceId,
        },
      });
      if (!checkout) {
        await ctx.prisma.checkout.create({
          data: {
            workspaceId: ctx.session.user.workSpaceId,
            Stripe: {
              create: {
                secret_key: input.secret_key,
                public_key: input.public_key,
              },
            },
          },
        });
      } else {
        await ctx.prisma.stripe.update({
          where: {
            checkoutId: checkout.id,
          },
          data: {
            secret_key: input.secret_key,
            public_key: input.public_key,
          },
        });
      }
      return "success";
    }),
  getStripe: protectedProcedure.query(({ ctx }) => {
    if (!ctx.session.user.isWorkspaceOwner)
      throw new TRPCError({
        message: "You are not a workspace owner",
        code: "UNAUTHORIZED",
      });
    return ctx.prisma.checkout.findFirst({
      where: {
        workspaceId: ctx.session.user.workSpaceId,
      },
      select: {
        Stripe: true,
      },
    });
  }),
  createIntent: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const invoice = await ctx.prisma.invoice.findUnique({
        where: {
          id: input.invoiceId,
        },
        include:{
          Client:true,
          service:true
        }
      });
      if (!invoice)
        throw new TRPCError({
          message: "Invoice not found",
          code: "NOT_FOUND",
        });
      if (invoice.clientId !== ctx.session.user.id)
        throw new TRPCError({
          message: "You are not authorized to pay this invoice",
          code: "UNAUTHORIZED",
        });
      if (invoice.status === "PAID")
        throw new TRPCError({
          message: "Invoice is already paid",
          code: "BAD_REQUEST",
        });
      if (!invoice.workspaceId) {
        throw new TRPCError({
          message: "Workspace not found",
          code: "BAD_REQUEST",
        });
      }
      const stripe_secret = await ctx.prisma.workspace.findUnique({
        where: {
          id: invoice.workspaceId,
        },
        select: {
          checkout: {
            select: {
              Stripe: true,
            },
          },
        },
      });
      if (!stripe_secret?.checkout?.Stripe?.secret_key || !stripe_secret?.checkout?.Stripe?.public_key) {
        throw new TRPCError({
          message: "Stripe not connected",
          code: "BAD_REQUEST",
        });
      }
      const stripe = new _stripe(stripe_secret?.checkout?.Stripe?.secret_key, {
        apiVersion: "2022-11-15",
      });
      const paymentIntent = await stripe.paymentIntents.create({
        amount: invoice.amount*100,
        currency: "USD",
        payment_method_types: ["card"],
        setup_future_usage: "off_session",
        metadata: {
          invoiceId: invoice.id,
        },
      });
      return {
        client_secret: paymentIntent.client_secret,
        public_key: stripe_secret?.checkout?.Stripe?.public_key,
        invoice
      };
    }),
});
