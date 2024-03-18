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
      authorId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {

    return await ctx.db.issue.create({
      data: {
        title: input.title,
        description: input.description,
        authorId: input.authorId,
      },
    });
  }),
  getById: publicProcedure.input(
    z.object({
      id: z.number(),
    })
  )
  .query(async ({ ctx, input }) => {

    return await ctx.db.issue.findUnique({
      where: {
        id: input.id,
      },
    });
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

    return await ctx.db.issue.update({
      where: {
        id: input.id,
      },
      data: {
        title: input.title,
        description: input.description,
        status: input.status
      }
    });
  }),
  filter: publicProcedure.input(
    z.object({
      status: z.enum(['OPEN', 'CLOSED', 'IN_PROGRESS']),
    })
  )
  .query(({ ctx, input }) => {

    return ctx.db.issue.findMany({
      where: {
        status: input.status
      }
    });
  }),
  delete: publicProcedure.input(
    z.object({
      issueId: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {

    await ctx.db.issue.delete({
      where: {
        id: input.issueId
      }
    });

    await ctx.db.comment.deleteMany({
      where: {
        issueId: input.issueId
      }
    });
  }),
});
