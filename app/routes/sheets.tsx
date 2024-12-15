import { Suspense, useCallback, useMemo, useState } from "react";

import { useLoaderData, useNavigate } from "@remix-run/react";

import { ColumnDef } from "@tanstack/react-table";
import { LoaderFunctionArgs } from "@vercel/remix";
import { useDebounce } from "react-use";

import { entities } from "~/.server/db/entities";
import { withOrm } from "~/.server/db/withOrm";
import { DataTable } from "~/components/data-table";
import { useUrlTableState } from "~/hooks/table";
import { useOptimisticSearchParams } from "~/hooks/use-optimistic-search-params";
import { diffColorClassMap } from "~/lib/colors";
import { cn } from "~/lib/utils";

export const loader = withOrm(
  async ({ context, request }: LoaderFunctionArgs, orm) => {
    const searchParams = new URL(request.url).searchParams;
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "25");

    const search = searchParams.get("search");
    if (limit > 100) {
      throw new Response("limit must be less than 100", { status: 400 });
    }

    const qb = orm.createQueryBuilder(entities.Sheet, "sheet");
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
    const diff = searchParams.get("diff");
    const diffFilter = diff?.split(",").filter(Boolean) ?? [];

    if (diffFilter.length > 0) {
      qb.andWhere({
        difficulty: {
          $in: diffFilter,
        },
      });
    }
    // Search
    if (search) {
      qb.andWhere({
        song_id: { $ilike: `%${search}%` },
      });
    }

    const orderBy = searchParams.get("sortBy") ?? "internalLevelValue";
    const dir = `${searchParams.get("dir") || "desc"} nulls last`;
    qb.orderBy([
      { [orderBy]: dir },
      {
        internalLevelValue: "ASC",
      },
    ]);
    qb.limit(limit).offset((page - 1) * limit);
    qb.joinAndSelect("song", "song");
    // filters
    const filterOptions = {
      category: await orm
        .findAll(entities.Category)
        .then((categories) => categories.map((category) => category.category)),
      difficulty: ["basic", "advanced", "expert", "master", "ultima"],
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

export default function SongsPage() {
  const navigate = useNavigate();

  const { data, count, page, limit, filterOptions } =
    useLoaderData<typeof loader>();

  const [searchParams, setSearchParams] = useOptimisticSearchParams();

  const tableState = useUrlTableState({
    pagination: {
      pageIndex: page,
      pageSize: limit,
    },
  });

  const columns = useMemo(
    () =>
      [
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
          id: "difficulty",
          accessorKey: "difficulty",
          header: "Difficulty",
          enableSorting: false,
          cell: ({ row }) => (
            <div
              className={cn(
                "text-xs font-bold uppercase",
                diffColorClassMap[row.original.difficulty]
              )}
            >
              {row.original.difficulty}
            </div>
          ),
        },
        {
          id: "internalLevelValue",
          accessorKey: "internalLevelValue",
          header: "Const",
          cell: ({ row }) => (
            <div className="text-sm">
              {row.original.internalLevelValue}{" "}
              <span className="text-xs font-light text-gray-400">
                / {row.original.level}
              </span>
            </div>
          ),
        },
        {
          id: "song.bpm",
          accessorKey: "song.bpm",
          header: "BPM",
          cell: ({ row }) => (
            <div className="text-xs">{row.original.song?.bpm}</div>
          ),
        },
      ] as ColumnDef<(typeof data)[0]>[],
    []
  );

  const applySearchParams = useCallback(
    (field: string, value?: string, clearPage = true) => {
      setSearchParams((prev) => {
        if (!value) {
          prev.delete(field);
        } else {
          prev.set(field, value);
        }
        if (clearPage) {
          prev.delete("page");
        }
        return prev;
      });
    },
    [setSearchParams]
  );

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  useDebounce(
    () => {
      if (searchParams.get("search") === search) return;
      applySearchParams("search", search);
    },
    300,
    [search, searchParams.get("search")]
  );

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable
          data={data ?? []}
          columns={columns}
          onRowClick={(row) => {
            navigate(`/song/${row.original.song.songId}`);
          }}
          rowCount={count}
          filters={[
            {
              filterType: "multiselect",
              label: "Category",
              multiSelectProps: {
                options: filterOptions.category.map((category) => ({
                  label: category,
                  value: category,
                })),
                label: "Category",
                triggerLabel: "Select category",
                value: searchParams.get("category")?.split(","),
                onValueChange: (v) => {
                  applySearchParams("category", v.join(","));
                },
              },
            },
            {
              filterType: "multiselect",
              label: "Difficulty",
              multiSelectProps: {
                options: filterOptions.difficulty.map((difficulty) => ({
                  label: difficulty[0].toUpperCase() + difficulty.slice(1),
                  value: difficulty,
                })),
                label: "Difficulty",
                triggerLabel: "Select difficulty",
                value: searchParams.get("diff")?.split(",") || undefined,
                onValueChange: (v) => {
                  applySearchParams("diff", v.join(","));
                },
              },
            },
            {
              filterType: "text",
              label: "Title",
              inputProps: {
                value: search,
                onChange: (e) => {
                  console.log("onchange");
                  setSearch(e.target.value);
                },
              },
            },
          ]}
          {...tableState}
        />
      </Suspense>
    </div>
  );
}
