import { LoaderFunctionArgs } from "@remix-run/node";
import { data, useLoaderData } from "@remix-run/react";

import { Song } from "~/.server/db/entities/song.entity";
import { withOrm } from "~/.server/db/withOrm";
import { Page } from "~/components/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const BASE_IMAGE_URL =
  "https://dp4p6x0xfi5o9.cloudfront.net/chunithm/img/cover/";

export const loader = withOrm(
  async ({ context, request, params }: LoaderFunctionArgs, orm) => {
    const songId = params.songId as string;
    const song = await orm.findOne(
      Song,
      { songId },
      {
        populate: ["sheets"],
        orderBy: {
          sheets: {
            internalLevelValue: "ASC",
          },
        },
      }
    );
    if (!song) {
      throw data(
        { notFound: true },
        {
          status: 404,
        }
      );
    }

    return {
      song,
      sheets: Array.from(song.sheets),
    };
  }
);

const diffColorMap: Record<string, string> = {
  basic: "#5d5",
  advanced: "#fa0",
  expert: "#f11",
  master: "#a0a",
};

export default function SongPage() {
  const { song, sheets } = useLoaderData<typeof loader>();
  const {
    songId,
    imageName,
    artist,
    category,

    releaseDate,
    version,
    bpm,
  } = song;

  return (
    <Page>
      <div className="flex gap-4 md:gap-8">
        <img
          src={`${BASE_IMAGE_URL}${imageName}`}
          alt={song.title}
          className="size-24 md:size-48"
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold md:text-4xl">{songId}</h1>
          <h2 className="text-md font-medium md:text-lg">{artist}</h2>
          <h3 className="text-base font-semibold text-muted-foreground md:text-xl">
            {category}
          </h3>
          <div className="text-xs text-muted-foreground md:text-sm">
            Added: {releaseDate?.toString()} {version}
          </div>
          <div className="text-xs text-muted-foreground md:text-sm">
            BPM: {bpm}
          </div>
        </div>
      </div>
      <div>
        <h2 className="py-4 text-center text-2xl font-semibold">Charts</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Const</TableHead>
              <TableHead>Note designer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sheets.map((sheet) => (
              <TableRow key={sheet.difficulty}>
                <TableCell
                  className="text-center font-bold uppercase"
                  style={{
                    color: diffColorMap[sheet.difficulty],
                  }}
                >
                  {sheet.difficulty}
                </TableCell>
                <TableCell>{sheet.level}</TableCell>
                <TableCell>{sheet.internalLevel}</TableCell>
                <TableCell>{sheet.noteDesigner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Page>
  );
}
