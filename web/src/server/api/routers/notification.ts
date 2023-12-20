import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const notificationRouter = createTRPCRouter({
  get: protectedProcedure.query(async({ ctx }) => {
    const notifications = await ctx.prisma.notification.findMany({
      where: {
        workspaceId: ctx.session.user.workSpaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const unreadCount = await ctx.prisma.notification.count({
      where:{
        read: false,
        workspaceId: ctx.session.user.workSpaceId,
      }
    })
    return {notifications,unreadCount};
  }),
  markAsRead: protectedProcedure.mutation(async({ ctx}) => {
    const notification = await ctx.prisma.notification.updateMany({
      where: {
        workspaceId: ctx.session.user.workSpaceId,
      },
      data: {
        read: true,
      },
    });
    return notification;
  }),
});
