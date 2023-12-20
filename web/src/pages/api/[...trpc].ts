import { createOpenApiNextHandler } from 'trpc-openapi';
import { appRouter } from '~/server/api/root';


export default createOpenApiNextHandler({ router: appRouter });