"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export function PostList() {
  const { data: latestPosts, isLoading } = api.post.getLatestPosts.useQuery();

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading posts...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {latestPosts?.map(
          (post) =>
            post && (
              <div className="relative transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg">
                <div className="relative rounded-xl bg-white/10 p-6">
                  <h3 className="text-lg font-semibold text-gray-700">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-700">
                    {post.content}
                  </p>
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title ?? "Post content"}
                      className="mt-4 h-48 w-full rounded-lg object-cover shadow-sm"
                    />
                  )}
                </div>
                {post.linkOut && (
                  <Link
                    className="absolute inset-0"
                    href={post.linkOut}
                    target="_blank"
                    key={post.id}
                  />
                )}
              </div>
            ),
        )}
        {(!latestPosts || latestPosts.length === 0) && (
          <p className="col-span-full text-center text-gray-500">
            No posts yet.
          </p>
        )}
      </div>
    </div>
  );
}
