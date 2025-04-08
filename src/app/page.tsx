import { CreatePost } from "~/app/_components/CreatePost";
import { PostList } from "~/app/_components/post";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center text-black">
        <PostList />
        <CreatePost />
      </main>
    </HydrateClient>
  );
}
