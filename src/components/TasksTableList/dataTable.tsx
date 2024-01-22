"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import React, { useState } from "react";
import { columns, Tasks } from "./columns";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { completeTask, deleteTask } from "@/state/taskSlice";
import { toast } from 'react-toastify';

interface DataTableDemoProps {
  data: Tasks[];
}

export function DataTableDemo({ data }: DataTableDemoProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const marked = () => toast.success("Marked tasks as completed!");
  const deleted = () => toast.success("Deleted tasks!");

  // access to redux reducers
  const dispatch = useDispatch();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // delete selected tasks
  const handleDeleteSelected = async () => {
    const selectedTaskIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id);
    selectedTaskIds.forEach((taskId) => dispatch(deleteTask(taskId) as any));

    // deleted successful message
    deleted()
  };

  // mark selected text as completed
  const handleCompleteSelected = async () => {
    const selectedTaskIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id);
    selectedTaskIds.forEach((taskId) => dispatch(completeTask(taskId) as any));

    // marked successful message
    marked()
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Filter task by status..."
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            const filterValue = event.target.value;
            // table.getColumn("title")?.setFilterValue(filterValue);
            table.getColumn("status")?.setFilterValue(filterValue);
          }}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto bg-orange hover:bg-orange/80 text-black">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize font-semibold"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                  data-state={row.getIsSelected() && "selected"}
                >
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
                    No Result
                  </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="font-semibold bg-purple hover:bg-purple/80 text-white"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="font-semibold bg-purple hover:bg-purple/80 text-white"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap justify-center items-center">
          <Button variant="outline" size="sm" className="font-semibold bg-purple hover:bg-purple/80 text-white" onClick={handleDeleteSelected}>
            Delete Selected
          </Button>
          <Button variant="outline" size="sm" className="font-semibold bg-purple hover:bg-purple/80 text-white" onClick={handleCompleteSelected}>
            Mark as Completed
          </Button>
        </div>
      )}
    </div>
  );
}
