import { startTransition, useMemo } from "react";

import {
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

import { useOptimisticSearchParams } from "~/hooks/use-optimistic-search-params";

export const useUrlTableState = (
  fallback: { pagination?: PaginationState } = {}
) => {
  const [searchParams, setSearchParams] = useOptimisticSearchParams();

  const pageIndex =
    parseInt(
      searchParams.get("page") ?? `${fallback.pagination?.pageIndex || 1}`
    ) - 1;
  const pageSize = parseInt(
    searchParams.get("limit") ?? `${fallback.pagination?.pageSize || 10}`
  );
  const sortBy = searchParams.get("sortBy");
  const dir = searchParams.get("dir");
  return useMemo(() => {
    const pagination: PaginationState = {
      pageIndex,
      pageSize,
    };
    const onPaginationChange: OnChangeFn<PaginationState> = (p) => {
      startTransition(() => {
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
      });
    };

    const sorting: SortingState = sortBy
      ? [{ id: sortBy, desc: dir === "desc" }]
      : [];

    const onSortingChange: OnChangeFn<SortingState> = (s) => {
      const newSorting = typeof s === "function" ? s(sorting) : s;
      if (newSorting.length === 0) {
        setSearchParams((prev) => {
          prev.delete("sortBy");
          prev.delete("dir");
          prev.delete("page");
          return prev;
        });
      } else {
        setSearchParams((prev) => {
          prev.set("sortBy", newSorting[0].id);
          prev.set("dir", newSorting[0].desc ? "desc" : "asc");
          prev.delete("page");
          return prev;
        });
      }
    };
    return {
      pagination,
      onPaginationChange,
      sorting,
      onSortingChange,
    };
  }, [dir, pageIndex, pageSize, setSearchParams, sortBy]);
};
