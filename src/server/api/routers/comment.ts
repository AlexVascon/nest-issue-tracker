import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { Comment } from "@prisma/client";
import { filterUserForClient } from "~/server/helpers/fetchUserForClient";
import { TRPCError } from "@trpc/server";

const addUserDataToComment = async (comments: Comment[]) => {
  const userId = comments.map((comment) => String(comment.authorId));
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 110,
    })
  ).map(filterUserForClient);

  return comments.map((comment) => {
    const author = users.find((user) => user.id === String(comment.authorId));

    if (!author) {
      console.error("AUTHOR NOT FOUND", comment);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${comment.id}, USER ID: ${comment.authorId}`,
      });
    }
    if (!author.username) {
      // user the ExternalUsername
      if (!author.externalUsername) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Author has no GitHub Account: ${author.id}`,
        });
      }
      author.username = author.externalUsername;
    }

    return {
      comment,
      author: {
        ...author,
        username: author.username ?? "(username not found)",
      },
    };
  })
}

export const commentRouter = createTRPCRouter({
  getIssueComments: publicProcedure.input( 
    z.object({
    issueId: z.number(),
  })
).query(async({ ctx, input }) => {
    const comments = await ctx.db.comment.findMany({
      where: {
        issueId: input.issueId,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return addUserDataToComment(comments);
  }),
  create: publicProcedure.input(
    z.object({
      issueId: z.number(),
      description: z.string(),
      authorId: z.string()
    })
  )
  .mutation(async ({ ctx, input }) => {

    const issue = await ctx.db.comment.create({
      data: {
        issueId: input.issueId,
        description: input.description,
        authorId: input.authorId
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
