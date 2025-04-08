"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();
  const [latestPosts] = api.post.getLatestPosts.useSuspenseQuery();
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [password, setPassword] = useState("");

  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.getLatest.invalidate();
      await utils.post.getLatestPosts.invalidate();
      setName("");
      setContent("");
      setImageUrl("");
      setPassword("");
    },
  });

  return (
    <div className="w-full max-w-xs">
      {latestPosts.map((post) => (
        <p key={post.id} className="truncate">
          {post.title}
        </p>
      ))}
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.title}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const result = await createPost.mutateAsync({
              title: name,
              content: content,
              imageUrl: imageUrl,
              password: password,
            });

            console.log(result);
          } catch (error) {
            console.error(error);
            // alert("Invalid password");
          }
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-black"
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-black"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-black"
        />
        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-black"
        />

        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
