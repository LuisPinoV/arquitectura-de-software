"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Box = {
  id: string;
  state: "Ocupado" | "Libre";
  usage: number;
};

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import { useLanguage } from "@/contexts/LanguageContext";

/*
const data: Box[] = [
  { id: "1", state: "Ocupado", usage: 75 },
  { id: "2", state: "Libre", usage: 20 },
  { id: "3", state: "Ocupado", usage: 50 },
  { id: "4", state: "Libre", usage: 10 },
  { id: "5", state: "Ocupado", usage: 40 },
  { id: "6", state: "Libre", usage: 60 },
  { id: "7", state: "Ocupado", usage: 30 },
  { id: "8", state: "Libre", usage: 80 },
  { id: "9", state: "Ocupado", usage: 15 },
  { id: "10", state: "Libre", usage: 90 },
  { id: "11", state: "Ocupado", usage: 55 },
];*/

export function BoxesDataTable() {
  const router = useRouter();
  const { t } = useLanguage();
  const columns: ColumnDef<Box>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("common.name")}
        <ArrowUpDown className="w-4 h-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{`Box ${row.getValue("id")}`}</div>,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "state",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("dashboard.state")}
        <ArrowUpDown className="w-4 h-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div
        className={
          row.getValue("state") === "Ocupado"
            ? "text-red-600"
            : "text-green-600"
        }
      >
        {row.getValue("state") === "Ocupado" ? t("dashboard.occupied") : t("dashboard.free")}
      </div>
    ),
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "usage",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("dashboard.usage")}
        <ArrowUpDown className="w-4 h-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{(row.getValue("usage") as number).toFixed(0)}%</div>
    ),
    sortingFn: "basic", // numeric sorting
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t("dashboard.openMenu")}</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("dashboard.actions")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {router.replace(`/dashboard/reportaje/boxes/${row.getValue("id")}`);
            }}
          >
            {t("dashboard.viewBox")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log(`Ver detalles ${row.original.id}`)}
          >
            {t("dashboard.schedule")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [data, setSpaceData] = React.useState<Box[]>([]);
  

  React.useEffect(() => {

    async function GetAllSpacesData() {
      try {
        const res = await apiFetch(
          `/api/reports/get_all_boxes_with_data`
        );
        const data = await res?.json();
        setSpaceData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    GetAllSpacesData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
    initialState: {
      pagination: {
        pageSize: 10, // max 10 rows per page
      },
    },
  });

  return (
    <div className="w-full">
      {/* Search input */}
      <div className="flex items-center py-2">
        <Input
          placeholder={t("common.search")}
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  {t("common.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-1 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t("common.previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {t("common.next")}
        </Button>
        <span className="ml-4 text-sm">
          {t("common.page")} {table.getState().pagination.pageIndex + 1} {t("common.of")}{" "}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  );
}
