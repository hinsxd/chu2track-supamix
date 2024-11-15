import { useCallback, useMemo, useState } from "react";

import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";

import { ColumnDef } from "@tanstack/react-table";
import { useDebounce } from "react-use";

import { entities } from "~/.server/db/entities";
import { withOrm } from "~/.server/db/withOrm";
import { DataTable } from "~/components/data-table";
import { useUrlTableState } from "~/hooks/table";
import { useOptimisticSearchParams } from "~/hooks/use-optimistic-search-params";

export const loader = withOrm(
  async ({ context, request }: LoaderFunctionArgs, orm) => {
    const searchParams = new URL(request.url).searchParams;
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "25");

    const search = searchParams.get("search");
    if (limit > 100) {
      throw new Response("limit must be less than 100", { status: 400 });
    }

    const qb = orm.createQueryBuilder(entities.Song, "song");

    // Categories
    const category = searchParams.get("category");
    const categoriesFilter = category?.split(",").filter(Boolean) ?? [];

    if (categoriesFilter.length > 0) {
      qb.andWhere({
        category: {
          $in: categoriesFilter,
        },
      });
    }

    // Search
    if (search) {
      qb.andWhere({
        title: {
          $ilike: `%${search}%`,
        },
      });
    }

    const orderBy = searchParams.get("sortBy") ?? "songId";
    const dir = searchParams.get("dir") ?? "asc";
    qb.orderBy([{ [orderBy]: dir }]);
    qb.limit(limit).offset((page - 1) * limit);

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
          accessorKey: "songId",
          header: "Title",
          cell: ({ row }) => (
            <Link to={`/song/${row.original.title}`}>
              <div className="text-xs font-bold">{row.original.songId}</div>
            </Link>
          ),
        },
        {
          accessorKey: "category",
          header: "Category",
          cell: ({ row }) => (
            <div className="text-xs">{row.getValue("category")}</div>
          ),
        },
        {
          accessorKey: "bpm",
          header: "BPM",
          cell: ({ row }) => <div className="text-xs">{row.original.bpm}</div>,
        },
      ] as ColumnDef<any>[],
    []
  );

  const applySearchParams = useCallback(
    (field: string, value?: string, clearPage = true) => {
      setSearchParams((prev) => {
        if (value === undefined) {
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
      <DataTable
        data={data ?? []}
        columns={columns}
        onRowClick={(row) => {
          navigate(`/song/${row.getValue("songId")}`);
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
    </div>
  );
}
