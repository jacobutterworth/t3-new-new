import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        imageUrl: z.string().min(1),
        password: z.string().min(1),
        linkOut: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.password !== env.SUPERSECRET_CREATE_PASSWORD) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid passworwsd",
        });
      }

      await ctx.db.insert(posts).values({
        title: input.title,
        content: input.content,
        imageUrl: input.imageUrl,
        linkOut: input.linkOut,
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),

  getLatestPosts: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      limit: 10,
    });

    return posts;
  }),
});
