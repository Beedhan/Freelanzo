import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const CreateTaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(40),
  taskSectionId: z.string(),
  projectId: z.string(),
});
const GetTasksSchema = z.object({
  projectId: z.string(),
});
const CreateTasksSectionSchema = z.object({
  projectId: z.string(),
  title: z.string().min(1).max(15),
  id: z.string().optional(),
});
export const tasksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateTaskSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const project = await ctx.prisma.project.findFirst({
          where: {
            workspaceId: ctx.session.user.workSpaceId,
            id: input.projectId,
          },
        });
        if (!project) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const taskSection = await ctx.prisma.taskSection.findFirst({
          where: {
            id: input.taskSectionId,
            projectId: input.projectId,
          },
        });
        if (!taskSection) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        if(input.id){
          await ctx.prisma.tasks.create({
            data: {
              id: input.id,
              title: input.title,
              taskSectionId: input.taskSectionId,
            },
          });
        }
        else{
          await ctx.prisma.tasks.create({
            data: {
              title: input.title,
              taskSectionId: input.taskSectionId,
            },
          });
       }
        await ctx.prisma.notification.create({
          data: {
            projectId: input.projectId,
            text: `New task created in project ${project?.name}`,
            type: "TASK",
            workspaceId: ctx.session.user.workSpaceId,
          },
        });
        return {
          success: true,
        };
      } catch (error) {
        console.log(error, "project creation error");
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  createSection: protectedProcedure
    .input(CreateTasksSectionSchema)
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          workspaceId: ctx.session.user.workSpaceId,
          id: input.projectId,
        },
      });
      if (!project) {
        throw new TRPCError({ code: "FORBIDDEN" });

      }
      if(input.id){

        await ctx.prisma.taskSection.create({
          data: {
            id: input.id,
            title: input.title,
            projectId: input.projectId,
          },
        });
      }
      else{
        await ctx.prisma.taskSection.create({
          data: {
            title: input.title,
            projectId: input.projectId,
          },
        })
      }
      return {
        success: true,
      };
    }),
  getTasks: protectedProcedure
    .input(GetTasksSchema)
    .query(async ({ ctx, input }) => {
      const taskSections = await ctx.prisma.taskSection.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy:{
          order:"asc"
        },
      });
      const tasks = await ctx.prisma.taskSection.findMany({
        where: {
          projectId: input.projectId,
        },
        select: {
          Tasks: {
            select: {
              id: true,
              title: true,
              taskSectionId: true,
              createdAt: true,
            },
          },
        },
        orderBy:{
          order:"desc"
        },
      });
      const processedTasks = tasks.flatMap((task) => task.Tasks);
      if (!tasks) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return { tasks: processedTasks, taskSections } || [];
    }),
    getTasksMobile: protectedProcedure
    .input(GetTasksSchema)
    .query(async ({ ctx, input }) => {
      const taskSections = await ctx.prisma.taskSection.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy:{
          order:"asc"
        },
        include:{
          Tasks:true
        }
      });
      return taskSections || [];
    }),

  updateSection: protectedProcedure
    .input(CreateTasksSectionSchema)
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          workspaceId: ctx.session.user.workSpaceId,
          id: input.projectId,
        },
      });
      if (!project) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      await ctx.prisma.taskSection.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
        },
      });
      return {
        success: true,
      };
    }),
  deleteSection: protectedProcedure
    .input(z.object({ id: z.string(), projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          workspaceId: ctx.session.user.workSpaceId,
          id: input.projectId,
        },
      });
      if (!project) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      await ctx.prisma.taskSection.delete({
        where: {
          id: input.id,
        },
      });
      return {
        success: true,
      };
    }),
  update: protectedProcedure
    .input(
      z.object({ id: z.string(), title: z.string(), projectId: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          workspaceId: ctx.session.user.workSpaceId,
          id: input.projectId,
        },
      });
      if (!project) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      await ctx.prisma.tasks.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
        },
      });
      return {
        success: true,
      };
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string(), projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          workspaceId: ctx.session.user.workSpaceId,
          id: input.projectId,
        },
      });
      if (!project) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      await ctx.prisma.tasks.delete({
        where: {
          id: input.id,
        },
      });
      return {
        success: true,
      };
    }),
  updateTasksPlacements: protectedProcedure
    .input(
      z.object({
        taskSectionId: z.string(),
        tasks: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const taskSection = await ctx.prisma.taskSection.findFirst({
        where: {
          id: input.taskSectionId,
        },
      });
      if (!taskSection) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      input.tasks.map(async (task, index) => {
        await ctx.prisma.tasks.update({
          where: {
            id: task,
          },
          data: {
            order: index,
            taskSectionId: input.taskSectionId,
          },
        });
      });
      return {
        success: true,
      };
    }),
    updateSectionsPlacements: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        taskSections: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          workspaceId: ctx.session.user.workSpaceId,
          id: input.projectId,
        },
      });
      if (!project) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      input.taskSections.map(async (taskSection, index) => {
        await ctx.prisma.taskSection.update({
          where: {
            id: taskSection,
          },
          data: {
            order: index,
          },
        });
      });
      return {
        success: true,
      };
    }),
});
