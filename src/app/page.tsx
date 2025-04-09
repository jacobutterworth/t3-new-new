import { unstable_noStore as noStore } from "next/cache";
import { CreatePost } from "~/app/_components/CreatePost";
import { PostList } from "~/app/_components/PostList";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  noStore();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center text-black">
        <PostList />
        <CreatePost />
      </main>
    </HydrateClient>
  );
}
