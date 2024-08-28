import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { utilityRouter } from "./routers/utility";
import { assignmentRouter } from "./routers/assignment";
import { presenceRouter } from "./routers/presence";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // uncomment the following lines to enable the routers
  user: userRouter,
  assignment: assignmentRouter,
  presence: presenceRouter,
  utility: utilityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
