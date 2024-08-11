import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
<<<<<<< HEAD
import { groupDetailsRouters } from "./userRouter/user";
import { userAgent } from "next/server";
=======
import { utilityRouter } from "./routers/utility";
import { assignmentRouter } from "./routers/assignment";
import { presenceRouter } from "./routers/presence";
import { userRouter } from "./routers/user";
>>>>>>> a7d81178ac67015c43ddea5a0f3a5a0176b4528b

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
<<<<<<< HEAD
    user: groupDetailsRouters
=======
  // uncomment the following lines to enable the routers
  user: userRouter,
  // assignment: assignmentRouter,
  // presence: presenceRouter,
  // utility: utilityRouter,
>>>>>>> a7d81178ac67015c43ddea5a0f3a5a0176b4528b
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
