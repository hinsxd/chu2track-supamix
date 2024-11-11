import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getOrm } from "~/db.server";
import { Song } from "~/db.server/entities/song.entity";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  console.log(context);
  const orm = await getOrm();

  const songs = await orm.findAll(Song);

  return { songs };
};

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
