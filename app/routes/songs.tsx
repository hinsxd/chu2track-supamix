import { useMemo } from "react";

import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

import { ColumnDef } from "@tanstack/react-table";

import { entities } from "~/.server/db/entities";
import { withOrm } from "~/.server/db/withOrm";
import { DataTable } from "~/components/data-table";
import { Page } from "~/components/page";
import { MultiSelect } from "~/components/ui/multi-select";
import { useUrlTableState } from "~/hooks/table";

export const loader = withOrm(
  async ({ context, request }: LoaderFunctionArgs, orm) => {
    const page = parseInt(new URL(request.url).searchParams.get("page") ?? "1");
    const limit = parseInt(
      new URL(request.url).searchParams.get("limit") ?? "10"
    );
    const category = new URL(request.url).searchParams.get("category");
    const categoriesFilter = category?.split(",").filter(Boolean) ?? [];
    if (limit > 100) {
      throw new Response("limit must be less than 100", { status: 400 });
    }

    const qb = orm.createQueryBuilder(entities.Song, "song");

    const orderBy =
      new URL(request.url).searchParams.get("orderBy") ?? "songId";
    const dir = new URL(request.url).searchParams.get("dir") ?? "asc";
    qb.orderBy([{ [orderBy]: dir }]);
    qb.limit(limit).offset((page - 1) * limit);
    console.log({ categoriesFilter });
    if (categoriesFilter.length > 0) {
      qb.andWhere({
        category: {
          $in: categoriesFilter,
        },
      });
    }
    const [data, count] = await qb.getResultAndCount();

    // filters
    const categories = await orm.findAll(entities.Category);

    const filterOptions = {
      category: categories.map((category) => category.category),
    };

    return {
      data,
      count,
      page,
      limit,
      maxPage: Math.ceil(count / limit),
      filterOptions,
    };
  }
);

export default function SongsPage() {
  const navigate = useNavigate();
  const { data, count, page, limit, filterOptions } =
    useLoaderData<typeof loader>();

  const [searchParams, setSearchParams] = useSearchParams();

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
          accessorKey: "category",
          header: "Category",
          cell: ({ row }) => (
            <div className="text-xs">{row.getValue("category")}</div>
          ),
        },
        {
          accessorKey: "songId",
          header: "Song",
          cell: ({ row }) => (
            <Link to={`/song/${row.original.title}`}>
              <div className="text-xs">{row.original.songId}</div>
            </Link>
          ),
        },
        {
          accessorKey: "bpm",
          header: "BPM",
          cell: ({ row }) => <div className="text-xs">{row.original.bpm}</div>,
        },
      ] as ColumnDef<(typeof data)[number]>[],
    []
  );

  return (
    <Page>
      <MultiSelect
        options={filterOptions.category.map((category) => ({
          label: category,
          value: category,
        }))}
        onValueChange={(v) => {
          setSearchParams((prev) => {
            if (v.length === 0) {
              prev.delete("category");
            } else {
              prev.set("category", v.join(","));
            }
            prev.delete("page");
            return prev;
          });
        }}
        defaultValue={searchParams.get("category")?.split(",")}
      />

      <DataTable
        data={data ?? []}
        columns={columns}
        onRowClick={(row) => {
          navigate(`/song/${row.getValue("songId")}`);
        }}
        rowCount={count}
        {...tableState}
      />
    </Page>
  );
}
