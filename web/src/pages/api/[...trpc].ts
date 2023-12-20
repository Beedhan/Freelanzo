import type{ PrismaClient, Prisma } from '@prisma/client';
import type{ MaybePromise } from '@trpc/server';
import type{ NodeHTTPCreateContextFnOptions } from '@trpc/server/dist/adapters/node-http';
import type{ NextApiRequest, NextApiResponse } from 'next';
import type{ Session } from 'next-auth';
import type{ JWT } from 'next-auth/jwt';
import { createOpenApiNextHandler } from 'trpc-openapi';
import { appRouter } from '~/server/api/root';


export default createOpenApiNextHandler({
    router: appRouter,
    createContext: function (opts: NodeHTTPCreateContextFnOptions<NextApiRequest, NextApiResponse>): MaybePromise<{ session: Session | null; prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>; token: JWT | null; }> {
        throw new Error('Function not implemented.');
    }
});