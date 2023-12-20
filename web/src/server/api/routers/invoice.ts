import { TRPCError } from "@trpc/server";
import { isPast } from "date-fns";
import { z } from "zod";
import { render } from "@react-email/render";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { sendEmail } from "~/utils/email";
import { HOST_URL } from "~/utils/lib";
import { InvoiceEmail } from "emails/invoice";

export const invoiceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        serviceId: z.string(),
        projectId: z.string(),
        amount: z.number(),
        due: z.date(),
        title: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { clientId, serviceId, amount, due, title, projectId } = input;
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
      });
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      await ctx.prisma.notification.create({
        data: {
          projectId: input.projectId,
          text: `New invoice has been created in project ${project?.name}`,
          type: "INVOICE",
          workspaceId: ctx.session.user.workSpaceId,
        },
      });
      const invoice = await ctx.prisma.invoice.create({
        data: {
          amount,
          dueDate: due.toISOString(),
          clientId,
          serviceId,
          workspaceId: ctx.session.user.workSpaceId,
          title,
          projectId,
        },
        include:{
          Client:true,
          Project:true
        }
      });
      const paymentUrl = `${HOST_URL}/invoice/pay/${invoice.id}`;
        try {
          if(invoice?.Client?.email && invoice?.Project?.name){
            await sendEmail({
              to: invoice?.Client?.email,
              subject: `New invoice`,
              html: render(InvoiceEmail({ paymentUrl,invoiceAmount:invoice.amount,projectName:invoice.Project.name })),
            });
          }
        } catch (error) {
          console.log(error);
        }
      return invoice;
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    if (!ctx.session.user.isWorkspaceOwner) {
      throw new TRPCError({
        message: "You are not allowed to perform this action",
        code: "FORBIDDEN",
      });
    }
    return ctx.prisma.invoice.findMany({
      where: {
        workspaceId: ctx.session.user.workSpaceId,
      },
      include: {
        Client: true,
      },
    });
  }),
  getProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.invoice.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          Client: true,
          service: true,
        },
      });
    }),
  getSummary: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      //calculate total amount, total paid, total unpaid, total overdue
      const invoices = await ctx.prisma.invoice.findMany({
        where: {
          projectId: input.projectId,
        },
      });
      const totalAmount = invoices.reduce((acc, curr) => acc + curr.amount, 0);
      const totalPaid = invoices.reduce(
        (acc, curr) => acc + (curr.status === "PAID" ? curr.amount : 0),
        0
      );
      const totalUnpaid = invoices.reduce(
        (acc, curr) => acc + (curr.status === "PENDING" ? curr.amount : 0),
        0
      );
      const totalOverdue = invoices.reduce(
        (acc, curr) =>
          acc +
          (isPast(curr.dueDate) && curr.status !== "PAID" ? curr.amount : 0),
        0
      );

      return {
        totalAmount,
        totalPaid,
        totalUnpaid,
        totalOverdue,
      };
    }),
  getWorkspaceSummary: protectedProcedure.query(async ({ ctx }) => {
    //calculate total amount, total paid, total unpaid, total overdue
    const invoices = await ctx.prisma.invoice.findMany({
      where: {
        workspaceId: ctx.session.user.workSpaceId,
      },
    });
    const totalAmount = invoices.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPaid = invoices.reduce(
      (acc, curr) => acc + (curr.status === "PAID" ? curr.amount : 0),
      0
    );
    const totalUnpaid = invoices.reduce(
      (acc, curr) => acc + (curr.status === "PENDING" ? curr.amount : 0),
      0
    );
    const totalOverdue = invoices.reduce(
      (acc, curr) =>
        acc +
        (isPast(curr.dueDate) && curr.status !== "PAID" ? curr.amount : 0),
      0
    );

    return {
      totalAmount,
      totalPaid,
      totalUnpaid,
      totalOverdue,
    };
  }),
});
