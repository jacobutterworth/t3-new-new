"use client";

import { api } from "~/trpc/react";

export function PostList() {
  const [latestPosts] = api.post.getLatestPosts.useSuspenseQuery();

  return (
    <div className="w-full max-w-xs">
      {/* <h2 className="mb-4 text-xl font-bold">Recent Posts</h2> */}
      <div className="space-y-2">
        {latestPosts.map(
          (post) =>
            post && (
              <div key={post.id} className="rounded-lg bg-white/10 p-4">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{post.content}</p>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title ?? "Post content"}
                    className="mt-2 h-32 w-full rounded object-cover"
                  />
                )}
              </div>
            ),
        )}
        {latestPosts.length === 0 && (
          <p className="text-center text-gray-500">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
