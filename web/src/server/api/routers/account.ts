import { z } from "zod";
import bcrypt from "bcrypt";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const accountRouter = createTRPCRouter({
  setPassword: protectedProcedure
    .input(
      z.object({
        password: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const hashedPassword = await bcrypt.hash(input.password, 10);
      await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });
      return { success: true };
    }),
  change: protectedProcedure
    .input(
      z.object({
        oldPassword: z.string().min(8),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!user || !user.password) {
        throw new TRPCError({ message: "User not found", code: "NOT_FOUND" });
      }
      const isPasswordCorrect = await bcrypt.compare(
        input.oldPassword,
        user?.password
      );
      if (!isPasswordCorrect) {
        throw new TRPCError({
          message: "Password doesnot match",
          code: "FORBIDDEN",
        });
      }
      const hashedPassword = await bcrypt.hash(input.password, 10);
      await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });
      return { success: true };
    }),
  passwordStatus: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const user = await ctx.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    return { hasPassword: user?.password !== null };
  }),
});
