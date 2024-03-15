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
  getById: publicProcedure.input(
    z.object({
      id: z.number(),
    })
  )
  .query(async ({ ctx, input }) => {

    const issue = await ctx.db.issue.findUnique({
      where: {
        id: input.id,
      },
    });
    return issue;
  }),
  update: publicProcedure.input(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      status: z.enum(['OPEN', 'CLOSED', 'IN_PROGRESS'])
    })
  )
  .mutation(async ({ ctx, input }) => {

    const issue = await ctx.db.issue.update({
      where: {
        id: input.id,
      },
      data: {
        title: input.title,
        description: input.description,
        status: input.status
      }
    });
    return issue;
  }),
});
