import { ComponentProps, useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { MultiSelect } from "~/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";

interface FilterBase {
  label: string;
}

type MultiSelectFilter = FilterBase & {
  filterType: "multiselect";
  multiSelectProps: ComponentProps<typeof MultiSelect>;
};

type SelectFilter = FilterBase & {
  filterType: "select";
  options: { group: string; items: { label: string; value: string }[] }[];
  selectProps?: ComponentProps<typeof Select>;
  triggerProps?: ComponentProps<typeof SelectTrigger>;
  placeholder?: string;
};

type TextFilter = FilterBase & {
  filterType: "text";
  inputProps?: ComponentProps<typeof Input>;
};

type SliderFilter = FilterBase & {
  filterType: "slider";
  sliderProps?: ComponentProps<typeof Slider>;
};

type Filter = SelectFilter | MultiSelectFilter | TextFilter | SliderFilter;

type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  pageCount?: number;
  rowCount?: number;
  onRowClick?: (row: Row<T>) => void;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  filters?: Filter[];
};

export function DataTable<T>({
  data,
  columns,
  pageCount,
  rowCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  onRowClick,
  filters,
}: DataTableProps<T>) {
  const [fallbackSorting, setFallbackSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [fallbackPagination, setFallbackPagination] = useState<PaginationState>(
    {
      pageIndex: pagination?.pageIndex ?? 0,
      pageSize: pagination?.pageSize ?? 10,
    }
  );

  const manualPagination = !!pagination;
  const manualSorting = !!sorting;
  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    manualPagination,
    onPaginationChange: onPaginationChange || setFallbackPagination,

    manualSorting,
    onSortingChange: onSortingChange || setFallbackSorting,
    pageCount,
    rowCount,
    state: {
      columnFilters,
      sorting: sorting || fallbackSorting,
      pagination: pagination || fallbackPagination,
    },
  });

  const max = table.getRowCount();
  const pageStart =
    table.getState().pagination.pageSize *
      table.getState().pagination.pageIndex +
    1;

  const pageEnd = Math.min(
    table.getState().pagination.pageSize *
      table.getState().pagination.pageIndex +
      table.getState().pagination.pageSize,
    max
  );

  const paginationStr = `${pageStart} - ${pageEnd} / ${max}`;

  const paginationRow = (
    <div className="space-x-2">
      <span className="text-sm font-medium text-gray-400">{paginationStr}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  );
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 py-4">
        <Filters filters={filters} />
        {paginationRow}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="max-md:hidden">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // sorting

                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "flex cursor-pointer select-none items-center gap-2"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === "asc"
                                ? "Sort ascending"
                                : header.column.getNextSortingOrder() === "desc"
                                  ? "Sort descending"
                                  : "Clear sort"
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <ArrowUpIcon className="size-4" />,
                            desc: <ArrowDownIcon className="size-4" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    onRowClick && "cursor-pointer",
                    "max-md:grid max-md:grid-cols-2 max-md:gap-1"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <TableCell key={cell.id} className="max-md:block">
                      <div className="hidden text-[10px] text-muted-foreground max-md:block">
                        {flexRender(
                          table.getVisibleFlatColumns()[i].columnDef.header,
                          table.getFlatHeaders()[i].getContext()
                        )}
                      </div>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {paginationRow}
      </div>
    </div>
  );
}

const Filters = ({ filters }: { filters?: Filter[] }) => {
  return (
    <div className="flex flex-row flex-wrap items-center gap-2">
      {filters?.map((filter) => {
        switch (filter.filterType) {
          case "select": {
            const {
              filterType: _,
              label,
              triggerProps,
              selectProps,
              placeholder,
              options,
            } = filter;
            return (
              <div key={filter.label}>
                <div className="text-sm font-medium text-muted-foreground">
                  {label}
                </div>
                <Select key={label} {...selectProps}>
                  <SelectTrigger {...triggerProps}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map(({ group, items }) => (
                      <SelectGroup key={group}>
                        <SelectLabel>{group}</SelectLabel>
                        {items.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }
          case "multiselect": {
            const { filterType: _, multiSelectProps } = filter;
            return (
              <div key={filter.label} className="min-w-28">
                <div className="text-sm font-medium text-muted-foreground">
                  {multiSelectProps.label}
                </div>
                <MultiSelect {...multiSelectProps} />
              </div>
            );
          }
          case "text": {
            const { filterType: _, label, inputProps } = filter;
            return (
              <div key={filter.label}>
                <div className="text-sm font-medium text-muted-foreground">
                  {label}
                </div>
                <Input key={label} {...inputProps} />
              </div>
            );
          }
          case "slider": {
            const { filterType: _, label, sliderProps } = filter;
            return (
              <div
                key={filter.label}
                className="flex min-w-28 flex-col self-stretch"
              >
                <div className="text-sm font-medium text-muted-foreground">
                  {label}
                </div>
                <div className="my-[0.5em]">
                  <Slider key={label} {...sliderProps} />
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-light text-gray-400">
                    {sliderProps?.value?.[0]}
                  </span>
                  <span className="text-xs font-light text-gray-400">
                    {sliderProps?.value?.[1]}
                  </span>
                </div>
              </div>
            );
          }
        }
      })}
    </div>
  );
};
