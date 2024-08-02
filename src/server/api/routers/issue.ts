import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/fetchUserForClient";

export const issueRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.issue.findMany();
  }),
  create: publicProcedure.input(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
      assigned: z.string(),
      image: z.string(),
      authorId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {

    return await ctx.db.issue.create({
      data: {
        title: input.title,
        description: input.description,
        priority: input.priority,
        assignedUsername: input.assigned,
        assignedImage: input.image,
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
      image: z.optional(z.string()),
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
        status: input.status,
        assignedImage: input.image
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
  assign: publicProcedure.input(
    z.object({
      username: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {

    const users = (
      await clerkClient.users.getUserList({
        username: [input.username],
        limit: 110,
      })
    ).map(filterUserForClient);

    return users;
  } 
  ),


});
