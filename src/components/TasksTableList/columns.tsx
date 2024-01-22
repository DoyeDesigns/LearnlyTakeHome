"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, CalendarIcon, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import React from "react";
import { useCellLogic } from "./customCellLogic";

export type Tasks = {
  id: string;
  title: string;
  status: "pending" | "completed" | "Overdue";
  description: string;
  date: Date | undefined;
};

export const MyCellComponent: React.FC<{
  row: any;
  column: any;
  table: any;
}> = ({ row }) => {
  const task = row.original;
  const {
    title,
    setTitle,
    description,
    setDescription,
    date,
    setDate,
    handleEdit,
    handleDelete,
    handleEditedChanges,
    handleCompleteTask,
  } = useCellLogic(task);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(task.id)}
          >
            Copy task ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <DialogTrigger asChild>
              <DropdownMenuItem onClick={handleEdit} className="p-0">
                <span className="w-full block text-left">Edit task</span>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCompleteTask(task.id)}>
            Mark as completed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* edit task popup dialog */}
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit {task.title}</DialogTitle>
            <DialogDescription>
              Edit task. Click &apos;Save Changes&apos; when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="title" className="mb-5">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Name of task"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description" className="mb-5">
                Your Message
              </Label>
              <Textarea
                placeholder="Type your task details here."
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <Popover>
                <p className="text-sm">Due date for task completion</p>
                <PopoverTrigger asChild>
                  <Button
                    id="due-date"
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select due date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                  <Select
                    onValueChange={(value: string) =>
                      setDate(addDays(new Date(), parseInt(value)))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="0">Today</SelectItem>
                      <SelectItem value="1">Tomorrow</SelectItem>
                      <SelectItem value="3">In 3 days</SelectItem>
                      <SelectItem value="7">In a week</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="rounded-md border">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      required
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-purple text-white font-semibold hover:bg-purple/80"
              disabled={!title || !description || !date}
              onClick={() => handleEditedChanges()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export const columns: ColumnDef<Tasks>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status");
      // Check the type of status before rendering
      const statusContent =
        typeof status === "string" ? (
          <div className={`lowercase ${getStatusColorClass(status)}`}>
            {status}
          </div>
        ) : null;

      return statusContent;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "date",
    header: () => <div>Due date</div>,
    cell: ({ row }) => {
      const date = row.getValue("date") as Date;

      console.log("Original Date:", date);

      // Checking if date is a valid Date object
      if (date instanceof Date && !isNaN(date.getTime())) {
        // Formating the date
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(date);

        return <div className="font-medium">{formattedDate}</div>;
      } else {
        // Handling the case where the date is not a valid Date object
        return <div className="font-medium">Invalid Date</div>;
      }
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: MyCellComponent,
  },
];

//helper function to get the appropriate color class based on status
function getStatusColorClass(status: string): string {
  switch (status) {
    case "completed":
      return "text-green-500";
    case "pending":
      return "text-yellow-500";
    case "Overdue":
      return "text-red-500";
    default:
      return ""; // default color class or an empty string
  }
}
