import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const filesRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async({ ctx, input }) => {
      const files = await ctx.prisma.files.findMany({
        where: {
          projectId: input.projectId,
        },
        include:{
          Invoice:true
        },
        orderBy:{
          createdAt: 'desc'
        }
      });
      const filteredFiles = files.map(file=>{
        if(ctx.session.user.isWorkspaceOwner){
          return file;
        }
        if(file.Invoice===null){
          return file;
        }
        
        if(file?.Invoice.status!=="PAID"){
          return {...file,url:null}
        }
        return file;
      })
      return filteredFiles;
    }),
    lock:protectedProcedure.
    input(z.object({
      invoiceId:z.string(),
      fileId:z.string()
    })).
    mutation(({ctx,input})=>{
      return ctx.prisma.files.update({
        where:{
          id:input.fileId
        },
        data:{
          invoiceId:input.invoiceId
        }
      })
    }),
    unlock:protectedProcedure.
    input(z.object({
      fileId:z.string()
    })).
    mutation(({ctx,input})=>{
      return ctx.prisma.files.update({
        where:{
          id:input.fileId
        },
        data:{
          invoiceId:null
        }
      })
    }),
    remove:protectedProcedure.
    input(z.object({
      fileId:z.string()
    })).
    mutation(({ctx,input})=>{
      return ctx.prisma.files.delete({
        where:{
          id:input.fileId
        }
      })
    }),
});
