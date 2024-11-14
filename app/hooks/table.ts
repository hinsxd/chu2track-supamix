import { useMemo } from "react";

import { useSearchParams } from "@remix-run/react";

import {
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

export const useUrlTableState = (
  fallback: { pagination?: PaginationState } = {}
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return useMemo(() => {
    const pagination: PaginationState = {
      pageIndex:
        parseInt(
          searchParams.get("page") ?? `${fallback.pagination?.pageIndex || 1}`
        ) - 1,
      pageSize: parseInt(
        searchParams.get("limit") ?? `${fallback.pagination?.pageSize || 10}`
      ),
    };
    const onPaginationChange: OnChangeFn<PaginationState> = (p) => {
      if (typeof p === "function") {
        const newPagination = p(pagination);
        setSearchParams((prev) => {
          prev.set("page", (newPagination.pageIndex + 1).toString());
          prev.set("limit", newPagination.pageSize.toString());
          return prev;
        });
      } else {
        setSearchParams((prev) => {
          prev.set("page", (p.pageIndex + 1).toString());
          prev.set("limit", p.pageSize.toString());
          return prev;
        });
      }
    };

    const sortBy = searchParams.get("sortBy");
    const dir = searchParams.get("dir");

    const sorting: SortingState = sortBy
      ? [{ id: sortBy, desc: dir === "desc" }]
      : [];

    const onSortingChange: OnChangeFn<SortingState> = (s) => {
      const newSorting = typeof s === "function" ? s(sorting) : s;
      if (newSorting.length === 0) {
        searchParams.delete("sortBy");
        searchParams.delete("dir");
        setSearchParams(searchParams);
      } else {
        setSearchParams({
          ...searchParams,
          sortBy: newSorting[0].id,
          dir: newSorting[0].desc ? "desc" : "asc",
        });
      }
    };
    return {
      pagination,
      onPaginationChange,
      sorting,
      onSortingChange,
    };
  }, [
    searchParams,
    fallback.pagination?.pageIndex,
    fallback.pagination?.pageSize,
    setSearchParams,
  ]);
};
