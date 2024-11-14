import { useMemo } from "react";

import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

import { ColumnDef } from "@tanstack/react-table";

import { Song } from "~/.server/db/entities/song.entity";
import { withOrm } from "~/.server/db/withOrm";
import { DataTable } from "~/components/data-table";
import { Page } from "~/components/page";

export const loader = withOrm(
  async ({ context, request }: LoaderFunctionArgs, orm) => {
    const page = parseInt(
      new URL(request.url).searchParams.get("pageIndex") ?? "1"
    );
    const limit = parseInt(
      new URL(request.url).searchParams.get("pageSize") ?? "10"
    );
    if (limit > 100) {
      throw new Response("limit must be less than 100", { status: 400 });
    }
    const orderBy = new URL(request.url).searchParams.get("orderBy") ?? "title";
    const dir = new URL(request.url).searchParams.get("dir") ?? "asc";

    const [data, count] = await orm.findAndCount(
      Song,
      {},
      {
        offset: (page - 1) * limit,
        limit: limit,
        orderBy: [{ [orderBy]: dir }],
      }
    );

    return {
      data,
      count,
      page,
      limit,
      maxPage: Math.ceil(count / limit),
    };
  }
);

export default function HighscoresPage() {
  const navigate = useNavigate();
  const { data, maxPage, count, page, limit } = useLoaderData<typeof loader>();

  const [searchParams, setSearchParams] = useSearchParams();
  const pagination = {
    pageIndex: parseInt(searchParams.get("pageIndex") ?? `${page - 1}`),
    pageSize: parseInt(searchParams.get("pageSize") ?? `${limit}`),
  };

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
          header: "songId",
          cell: ({ row }) => (
            <Link to={`/song/${row.getValue("songId")}`}>
              <div className="text-xs">{row.getValue("songId")}</div>
            </Link>
          ),
        },
        {
          size: 100,
          accessorKey: "bpm",
          header: "BPM",
          cell: ({ row }) => (
            <div className="text-xs">{row.getValue("bpm")}</div>
          ),
        },
      ] as ColumnDef<(typeof data)[number]>[],
    []
  );

  return (
    <Page>
      <DataTable
        data={data ?? []}
        columns={columns}
        pagination={pagination}
        onPaginationChange={(p) => {
          if (typeof p === "function") {
            const newPagination = p(pagination);
            setSearchParams({
              pageIndex: (newPagination.pageIndex + 1).toString(),
              pageSize: newPagination.pageSize.toString(),
            });
          }
        }}
        pageCount={maxPage}
        rowCount={count}
        onRowClick={(row) => {
          navigate(`/song/${row.getValue("songId")}`);
        }}
      />
    </Page>
  );
}
