import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { CreateProjectSchema } from "~/components/projects/CreateForm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const GetProjectSchema = z.object({
  projectId: z.string(),
});

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateProjectSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const workspace = await ctx.prisma.workspace.findFirst({
          where: {
            ownerId: ctx.session.user.id,
          },
        });
        if (!workspace) {
          throw new TRPCError({
            code: "FORBIDDEN",
            cause: "No workspace found for this user",
            message: "No workspace found for this user",
          });
        }
        const project = await ctx.prisma.project.create({
          data: {
            name: input.title,
            description: input.description,
            deadLine: input.deadLine,
            workspaceId: workspace.id,
            TaskSection: {
              create: {
                title: "No section",
              },
            },
          },
        });
        return {
          success: true,
          projectId: project.id,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
      }
    }),
  getSecretMessage: protectedProcedure.query(() => {
    return "You can now see this secret message!";
  }),
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const workspace = await ctx.prisma.workspace.findFirst({
      where: {
        id: ctx.session.user.workSpaceId,
      },
    });
    if (!workspace) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Workspace not found",
      });
    }
    if(ctx.session.user.isWorkspaceOwner){
      return ctx.prisma.project.findMany({
        where: {
          workspaceId: workspace.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }else{
      return ctx.prisma.project.findMany({
        where: {
          workspaceId: workspace.id,
          UsersOnProjects:{
            some:{
              userId:ctx.session.user.id
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
  }),
  getProject: protectedProcedure
    .input(GetProjectSchema)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.project.findFirst({
        where: {
          id: input.projectId,
          workspaceId: ctx.session.user.workSpaceId,
        },
      });
    }),
  getClientsInProject: protectedProcedure
    .input(GetProjectSchema)
    .query(async ({ ctx, input }) => {
      try {
        return ctx.prisma.project.findFirst({
          where: {
            id: input.projectId,
            workspaceId: ctx.session.user.workSpaceId,
          },
          select: {
            UsersOnProjects:{
              select:{
                user:{
                  select:{
                    id:true,
                    name:true,
                    email:true,
                    image:true,
                  }
                }
              }
            }
            }
          })
      } catch (error) {
        console.log(error)
      }
    }),
    getClientsNotInProject: protectedProcedure
    .input(GetProjectSchema)
    .query(async ({ ctx, input }) => {
      const usersInWorkspace=await ctx.prisma.usersOnWorkspaces.findMany({
        where: {
          workspaceId: ctx.session.user.workSpaceId,
        },
        select: {
          user:{
            select:{
              id:true,
              name:true,
              email:true,
              image:true,
            }
          }
     } })
      const usersInProject=await ctx.prisma.project.findFirst({  
        where: {
          id: input.projectId,
        },
        select: {
          UsersOnProjects:{
            select:{
              user:{
                select:{
                  id:true,
                  name:true,
                  email:true,
                  image:true,
                }
              }
            }
          }
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const usersNotInProject=usersInWorkspace.filter((user)=>!usersInProject?.UsersOnProjects.find((userInProject)=>userInProject.user.id===user.user.id))
      return usersNotInProject;
    }
    ),
    addClientToProject: protectedProcedure.input(z.object({projectId:z.string(),clientId:z.string()})).mutation(async ({ ctx, input }) => {
      try {
        if(!ctx.session.user.isWorkspaceOwner){
          throw new TRPCError({
            code: "FORBIDDEN",
            cause: "You are not allowed to add clients to projects",
            message: "You are not allowed to add clients to projects",
          });
        }
        const project = await ctx.prisma.project.findFirst({
          where: {
            id: input.projectId,
          },
        });
        if (!project) {
          throw new TRPCError({
            code: "FORBIDDEN",
            cause: "No project found for this user",
            message: "No project found for this user",
          });
        }
        const user = await ctx.prisma.user.findFirst({
          where: {
            id: input.clientId,
          },
        });
        if (!user) {
          throw new TRPCError({
            code: "FORBIDDEN",
            cause: "No user found for this user",
            message: "No user found for this user",
          });
        }
        const userOnProject = await ctx.prisma.project.update({
          where:{
            id:input.projectId
          },
          data: {
            UsersOnProjects:{
              create:{
                userId:input.clientId
              }
            }
          },
        });
        return {
          success: true,
          userOnProject,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
      }
    }
    ),
    removeClientFromProject: protectedProcedure.input(z.object({projectId:z.string(),clientId:z.string()})).mutation(async ({ ctx, input }) => {
      try {
        if(!ctx.session.user.isWorkspaceOwner){
          throw new TRPCError({
            code: "FORBIDDEN",
            cause: "You are not allowed to remove clients from projects",
            message: "You are not allowed to remove clients from projects",
          });
        }
        // const workspace = await ctx.prisma.workspace.findFirst({
        //   where: {
        //     id: ctx.session.user.workSpaceId,
        //   },
        // });
        // if(workspace?.ownerId!==ctx.session.user.id){
        //   throw new TRPCError({
        //     code: "FORBIDDEN",
        //     cause: "You are not allowed to remove clients from projects",
        //     message: "You are not allowed to remove clients from projects",
        //   });
        // }
        const project = await ctx.prisma.project.findFirst({
          where: {
            id: input.projectId,
          },
        });
        if (!project) {
          throw new TRPCError({
            code: "FORBIDDEN",
            cause: "No project found for this user",
            message: "No project found for this user",
          });
        }
        const user = await ctx.prisma.user.findFirst({
          where: {
            id: input.clientId,
          },
        });
        if (!user) {
          throw new TRPCError({
            code: "FORBIDDEN",
            cause: "No user found for this user",
            message: "No user found for this user",
          });
        }
        const userOnProject = await ctx.prisma.project.update({
          where:{
            id:input.projectId
          },
          data: {
            UsersOnProjects:{
              delete:{
                userId_projectId:{
                  userId:input.clientId,
                  projectId:input.projectId
                }
              }
            }
          },
        });
        return {
          success: true,
          userOnProject,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
      }
    }
    ),
});
