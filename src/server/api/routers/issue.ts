import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const issueRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.issue.findMany();
  }),
  create: publicProcedure.input(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {

    const issue = await ctx.db.issue.create({
      data: {
        title: input.title,
        description: input.description,
      },
    });

    return issue;
  }),
});
