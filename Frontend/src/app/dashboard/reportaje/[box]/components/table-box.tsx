"use client";

import * as React from "react";
import { apiFetch } from "@/lib/apiClient";
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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

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

export type Schedule = {
  idAgendamiento: number;
  date: string;
  time: string;
};

export function ScheduleTable({ box }: { box: any }) {
  const columns: ColumnDef<Schedule>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="w-4 h-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{new Date(row.original.date).toLocaleDateString()}</div>,
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "time",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hora
          <ArrowUpDown className="w-4 h-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.original.time}</div>,
      sortingFn: "alphanumeric",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                console.log("Cancelar agendamiento:", row.original.idAgendamiento);
                // TODO: call cancel API here
              }}
            >
              Cancelar hora
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [data, setScheduleData] = React.useState<Schedule[]>([]);

  React.useEffect(() => {
    async function GetScheduleData() {
      try {
        const res = await apiFetch(
          `/dashboard/reportaje/boxes/api/get_data_schedules_box?idBox=${box}`
        );
        if (!res) {
          console.error("No response from apiFetch for get_data_schedules_box");
          return;
        }
        const data = await res.json();
        console.log("Fetched schedules:", data);
        setScheduleData(data);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    }

    GetScheduleData();
  }, [box]);

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
        pageSize: 10,
      },
    },
  });

  return (
    <div className="w-full">
      {/* Search input */}
      <div className="flex items-center py-2">
        <Input
          placeholder="Buscar..."
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
                  No hubo resultados.
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
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
        <span className="ml-4 text-sm">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  );
}
