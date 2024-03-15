import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { issueRouter } from "./routers/issue";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  issue: issueRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
