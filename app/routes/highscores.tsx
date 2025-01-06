import { useMemo } from "react";

import { useLoaderData, useNavigate } from "@remix-run/react";

import { ColumnDef } from "@tanstack/react-table";
import { LoaderFunctionArgs } from "@vercel/remix";

import { entities } from "~/.server/db/entities";
import { withOrm } from "~/.server/db/withOrm";
import { ComboBadge } from "~/components/badges/combo";
import { ScoreBadge } from "~/components/badges/score";
import { DataTable } from "~/components/data-table";
import { useUrlTableState } from "~/hooks/table";

export const loader = withOrm(
  async ({ context, request }: LoaderFunctionArgs, orm) => {
    const searchParams = new URL(request.url).searchParams;
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "25");

    const search = searchParams.get("search");
    if (limit > 100) {
      throw new Response("limit must be less than 100", { status: 400 });
    }

    const qb = orm.createQueryBuilder(entities.Highscore);
    // Categories
    const category = searchParams.get("category");
    const categoriesFilter = category?.split(",").filter(Boolean) ?? [];

    // console.log(categoriesFilter);
    if (categoriesFilter.length > 0) {
      qb.andWhere({
        "song.category": {
          $in: categoriesFilter,
        },
      });
    }
    // Search
    if (search) {
      qb.andWhere({
        song_id: { $ilike: `%${search}%` },
      });
    }

    const orderBy = searchParams.get("sortBy") || "rating";
    const dir = `${searchParams.get("dir") || "desc"} nulls last`;

    qb.orderBy([
      {
        [orderBy]: dir,
      },
    ]);
    qb.limit(limit).offset((page - 1) * limit);
    qb.joinAndSelect("song", "song");
    qb.joinAndSelect("sheet", "sheet");
    // filters
    const filterOptions = {
      category: await orm
        .findAll(entities.Category)
        .then((categories) => categories.map((category) => category.category)),
    };

    const [data, count] = await qb.getResultAndCount();

    return {
      data,
      count,
      page,
      limit,
      filterOptions,
    };
  }
);

export default function HighscoresPage() {
  const navigate = useNavigate();
  const { data, count, page, limit, filterOptions } =
    useLoaderData<typeof loader>();
  const columns = useMemo(
    () =>
      [
        {
          id: "rank",
          accessorKey: "rank",
          header: "Rank",
          cell: ({ row }) => (
            <div className="text-sm font-semibold text-white">
              {row.index + 1 + (page - 1) * limit}
            </div>
          ),
        },
        {
          id: "song.songId",
          accessorKey: "song.songId",

          header: "Song",
          cell: ({ row }) => (
            <div>
              <div className="text-sm font-semibold text-white">
                {row.original.song?.songId}
              </div>
              <div className="text-xs font-light text-gray-400">
                {row.original.song?.category}
              </div>
            </div>
          ),
        },
        {
          size: 200,
          accessorKey: "score",
          header: "Score",
          cell: ({ getValue, row }) => (
            <div className="flex flex-col gap-1 text-xs md:flex-row md:items-center">
              <span className="text-sm font-medium text-white">
                {row.original.score.toLocaleString("en-US")}
              </span>
              <div className="flex gap-2">
                <ScoreBadge {...row.original} />
                <ComboBadge {...row.original} />
              </div>
            </div>
          ),
        },
        {
          size: 100,
          accessorKey: "rating",
          header: "Rating",
          cell: ({ getValue, row }) => (
            <div>
              <span className="text-sm font-medium text-gray-300">
                {row.original.rating}
              </span>

              <span className="text-xs text-gray-400">
                {" / "}
                {row.original.sheet?.internalLevelValue}
              </span>
            </div>
          ),
        },
      ] as ColumnDef<(typeof data)[number]>[],
    [limit, page]
  );

  const tableState = useUrlTableState({
    pagination: {
      pageIndex: page,
      pageSize: limit,
    },
  });
  return (
    <div>
      <DataTable
        data={data ?? []}
        columns={columns}
        rowCount={count}
        onRowClick={(row) => {
          navigate(`/song/${encodeURIComponent(row.original.song!.songId)}`);
        }}
        {...tableState}
      />
    </div>
  );
}
