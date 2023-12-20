import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const servicesRouter = createTRPCRouter({
  services: protectedProcedure.query(async ({ ctx }) => {
    const services = await ctx.prisma.services.findMany({
      where: {
        workspaceId: ctx.session.user.workSpaceId,
      },
    });
    return services;
  }),
  add: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const services = await ctx.prisma.services.create({
        data: {
          name: input.name,
          price: input.price,
          workspaceId: ctx.session.user.workSpaceId,
        },
      });
      return services;
    }),
    edit: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const services = await ctx.prisma.services.update({
        where:{
          id: input.id
        },
        data: {
          name: input.name,
          price: input.price,
        },
      });
      return services;
    }),
});
