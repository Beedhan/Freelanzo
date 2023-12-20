import { render } from "@react-email/render";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import { InvitationConfirmEmail } from "emails/invitation";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { sendEmail } from "./../../../utils/email";
import { Prisma } from "@prisma/client";
import logger from "logger";
import { HOST_URL } from "~/utils/lib";
const InviteUserSchema = z.object({
  email: z.string(),
});
export const workspaceRouter = createTRPCRouter({
  invite: protectedProcedure
    .input(InviteUserSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const token = crypto.randomBytes(24).toString("hex");
        const workspace = await prisma.workspace.findUnique({
          where: {
            id: ctx.session.user.workSpaceId,
          },
        });
        if (!workspace || workspace.ownerId !== ctx.session.user.id) {
          throw new TRPCError({
            message: "Cannot perform this action",
            code: "BAD_REQUEST",
          });
        }
        if (input.email === ctx.session.user.email) {
          throw new TRPCError({
            message: "Cannot invite yourself",
            code: "BAD_REQUEST",
          });
        }
        const user = await prisma.user.findUnique({
          where: {
            email: input.email,
          },
        });
        const userInvitation = await prisma.invitation.findFirst({
          where: {
            email: input.email,
          },
        });
        if (userInvitation) {
          throw new TRPCError({
            message: "User already invited",
            code: "BAD_REQUEST",
          });
        }
        if (user) {
          const userOnWorkspace = await prisma.usersOnWorkspaces.findFirst({
            where: {
              userId: user.id,
            },
          });
          if (userOnWorkspace) {
            throw new TRPCError({
              message: "User already joined",
              code: "BAD_REQUEST",
            });
          }
        }
        const invitation = await prisma.invitation.create({
          data: {
            email: input.email,
            token,
            workspaceId: ctx.session.user.workSpaceId,
          },
        });
        const invitationUrl = `${HOST_URL}/invitation?token=${invitation.token}&inviteId=${invitation.id}`;
        try {
          await sendEmail({
            to: input.email,
            subject: `Join your workspace`,
            html: render(InvitationConfirmEmail({ invitationUrl })),
          });
        } catch (error) {
          console.log(error);
        }
        logger.info(`Invitation sent to ${input.email}`);
        return { success: true };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              message: "User already invited",
              code: "BAD_REQUEST",
              cause: error,
            });
          }
        }
        if (error instanceof TRPCError) {
          throw error;
        }
      }
    }),
  join: protectedProcedure
    .input(
      z.object({
        token: z.string(),
        inviteId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const invitation = await prisma.invitation.findUnique({
          where: {
            id: input.inviteId,
          },
        });
        if (!invitation) {
          throw new TRPCError({
            message: "Invitation not found",
            code: "BAD_REQUEST",
          });
        }
        if (invitation.token !== input.token) {
          throw new TRPCError({
            message: "Invalid token",
            code: "BAD_REQUEST",
          });
        }
        if (invitation.email !== ctx.session.user.email) {
          throw new TRPCError({
            message: "Invalid email",
            code: "BAD_REQUEST",
          });
        }

        await prisma.workspace.update({
          where: {
            id: invitation.workspaceId,
          },
          data: {
            UsersOnWorkspaces: {
              create: {
                userId: ctx.session.user.id,
              },
            },
          },
        });
        await prisma.invitation.delete({
          where: {
            id: invitation.id,
          },
        });
        return { success: true };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              message: "User already invited",
              code: "BAD_REQUEST",
              cause: error,
            });
          }
        }
        if (error instanceof TRPCError) {
          throw error;
        }
      }
    }),
  getClients: protectedProcedure.query(async ({ ctx }) => {
    const invitations = await prisma.invitation.findMany({
      where: {
        workspaceId: ctx.session.user.workSpaceId,
      },
    });
    const usersInWorkspace = await prisma.usersOnWorkspaces.findMany({
      where: {
        workspaceId: ctx.session.user.workSpaceId,
      },
      select: {
        user: true,
        createdAt: true,
      },
    });
    const invited = invitations.map((invitation) => {
      return {
        email: invitation.email,
        invited: true,
        id: invitation.id,
      };
    });
    return [...invited, ...usersInWorkspace];
  }),
  removeInvitation: protectedProcedure
    .input(
      z.object({
        userEmail: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const workspace = await prisma.workspace.findUnique({
          where: {
            id: ctx.session.user.workSpaceId,
          },
        });
        if (!workspace || workspace.ownerId !== ctx.session.user.id) {
          throw new TRPCError({
            message: "Cannot perform this action",
            code: "BAD_REQUEST",
          });
        }
        await prisma.invitation.delete({
          where: {
            email: input.userEmail,
          },
        });
        return { success: true };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
        }
        if (error instanceof TRPCError) {
          throw error;
        }
      }
    }),
  removeUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const workspace = await prisma.workspace.findUnique({
          where: {
            id: ctx.session.user.workSpaceId,
          },
        });
        if (!workspace || workspace.ownerId !== ctx.session.user.id) {
          throw new TRPCError({
            message: "Cannot perform this action",
            code: "BAD_REQUEST",
          });
        }
        const user = await prisma.user.findUnique({
          where: {
            id: input.userId,
          },
        });
        if (!user) {
          throw new TRPCError({
            message: "User not found",
            code: "BAD_REQUEST",
          });
        }
        await prisma.usersOnProjects.deleteMany({
          where: {
            userId: input.userId,
          },
        })
        await prisma.usersOnWorkspaces.delete({
          where: {
            userId_workspaceId: {
              userId: input.userId,
              workspaceId: ctx.session.user.workSpaceId,
            },
          },
        });
        return { success: true };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
        }
        if (error instanceof TRPCError) {
          throw error;
        }
      }
    }),
  joined: protectedProcedure.query(async ({ ctx }) => {
    const usersInWorkspace = await prisma.usersOnWorkspaces.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        workspace: {
          select: {
            owner: true,
            id: true,
          },
        },
        createdAt: true,
      },
    });
    return usersInWorkspace;
  }),
  joinedClients: protectedProcedure.query(async ({ ctx }) => {
    const usersInWorkspace = await prisma.usersOnWorkspaces.findMany({
      where: {
        workspaceId: ctx.session.user.workSpaceId,
      },
      select: {
        user: true,
        createdAt: true,
      },
    });
    return usersInWorkspace;
  }),
  clients: protectedProcedure.query(async ({ ctx }) => {
    const usersInWorkspace = await prisma.workspace.findFirst({
      where: {
        id: ctx.session.user.workSpaceId,
      },
      include: {
        UsersOnWorkspaces: {
          include: {
            user: {
              include: {
                Invoice: {
                  where: {
                    workspaceId: ctx.session.user.workSpaceId,
                  },
                },
                UsersOnProjects: {
                  where: {
                    project: {
                      workspaceId: ctx.session.user.workSpaceId,
                    },
                  },
                  include: {
                    project: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return usersInWorkspace;
  }),
  getSingleClient: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const usersInWorkspace = await prisma.usersOnWorkspaces.findFirst({
        where: {
          userId: input.userId,
        },
        include: {
          user: {
            include: {
              Invoice: {
                where: {
                  workspaceId: ctx.session.user.workSpaceId,
                },
              },
              UsersOnProjects: {
                where: {
                  project: {
                    workspaceId: ctx.session.user.workSpaceId,
                  },
                },
                include: {
                  project: true,
                },
              },
            },
          },
        },
      });
      return usersInWorkspace;
    }),
});
