import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const conversationRouter = createTRPCRouter({
  sendMessage: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(async({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
      });
      if(!project){
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      await ctx.prisma.notification.create({
        data: {
          projectId: input.projectId,
          text: `New message in ${project?.name} project`,
          type: "MESSAGE",
          workspaceId: ctx.session.user.workSpaceId,
        },
      });
      return ctx.prisma.message.create({
        data: {
          text: input.message,
          projectId: input.projectId,
          userId: ctx.session.user.id,
        },
      });
    }),
  getMessages: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.message.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: true,
        },
      });
    }),
  sendInteralNote: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.session.user.isWorkspaceOwner) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });
      }
      return ctx.prisma.internalNote.create({
        data: {
          text: input.message,
          projectId: input.projectId,
        },
      });
    }),
  getInternalNotes: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      if (!ctx.session.user.isWorkspaceOwner) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });
      }
      return ctx.prisma.internalNote.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }),
  deleteInternalNotes: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.session.user.isWorkspaceOwner) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });
      }
      return ctx.prisma.internalNote.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
