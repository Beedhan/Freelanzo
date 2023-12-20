import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { projectRouter } from "~/server/api/routers/project";
import { tasksRouter } from "./routers/tasks";
import { workspaceRouter } from "./routers/workspace";
import { paymentRouter } from "./routers/payment";
import { filesRouter } from "./routers/files";
import { servicesRouter } from "./routers/services";
import { accountRouter } from "./routers/account";
import { invoiceRouter } from "./routers/invoice";
import { checkoutRouter } from "./routers/checkout";
import { conversationRouter } from "./routers/conversation";
import { notificationRouter } from "./routers/notification";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  projects: projectRouter,
  tasks: tasksRouter,
  workspace: workspaceRouter,
  payment: paymentRouter,
  files: filesRouter,
  services: servicesRouter,
  account:accountRouter,
  invoice:invoiceRouter,
  checkout:checkoutRouter,
  conversation:conversationRouter,
  notification:notificationRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
