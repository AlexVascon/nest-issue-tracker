import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { User } from "@prisma/client";

export const userRouter = createTRPCRouter({
  login: publicProcedure
  .input(
    z.object({
      username: z.string(),
      img_url: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {

    const user: User = await ctx.db.user.upsert({
      where: {
        username: input.username
      },
     update: {
        username: input.username,
        img_url: input.img_url,
      },
      create: {
        username: input.username,
        img_url: input.img_url,
      },
    });
    return user;
  }),
  assign: publicProcedure
  .input(
    z.object({
      username: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {

    const user = await ctx.db.user.findMany({
      where: {
        username: {
          contains: input.username
        } 
      }
    });
    return user;
  }),
});
