import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Song } from "~/.server/db/entities/song.entity";
import { withOrm } from "~/.server/db/withOrm";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = withOrm(
  async (orm, { request, context }: LoaderFunctionArgs) => {
    await orm.insert(Song, {
      songId: Date.now().toString(),
      category: "Pop",
      title: "Song 1",
      artist: "Artist 1",
    });
    const songs = await orm.findAll(Song);

    return { songs };
  }
);

export default function Index() {
  const { songs } = useLoaderData<typeof loader>();
  return (
    <div>
      {songs.map((song) => (
        <div key={song.songId}>{song.songId}</div>
      ))}
    </div>
  );
}
