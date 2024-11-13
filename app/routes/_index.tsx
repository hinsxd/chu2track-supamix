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
  async ({ request, context }: LoaderFunctionArgs, orm) => {
    const songs = await orm.findAll(Song);

    return { songs, d: new Date() };
  }
);

export default function Index() {
  const { songs, d } = useLoaderData<typeof loader>();

  return (
    <div>
      {songs.map((song) => (
        <div key={song.songId}>{song.songId}</div>
      ))}
    </div>
  );
}
