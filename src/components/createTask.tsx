"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "@/components/ui/textarea";
import { collection, addDoc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "@/state/taskSlice";
import { RootState, AppDispatch } from "@/state/store";
import { toast } from 'react-toastify';

export default function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>();

  const success = () => toast.success("Successfully created task!");
  const failed = () => toast.error("Failed to create task, try again!");

  //access redux store
  const dispatch: AppDispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.list);

  // create a task function
  const handleCreateTask = async () => {
    const newTask = {
      title: title,
      description: description,
      date: date,
      status: "pending" as "pending",
    };

    try {
      const docRef = collection(db, "Tasks");

      // Add the document to firebase
      const addedDocRef = await addDoc(docRef, newTask);

      console.log("Document added successfully");

      // success notification messagge
      success()
      

      // Retrieve the DocumentSnapshot for the added document
      const docSnap = await getDoc(addedDocRef);

      // Check if the document exists
      if (docSnap.exists()) {
        // Access the document ID
        const documentId = docSnap.id;

        // add task to redux store
        dispatch(addTask({ ...newTask, id: documentId }));
      } else {
        console.log("Document does not exist");
      }

      // Reset form values after successful upload
      setTitle("");
      setDescription("");
      setDate(undefined);
    } catch (e) {
      console.error("Error adding document: ", e);
      // failed notification message
      failed()
    }
  };

  // Logic to handle state changes, e.g., re-rendering the component
  useEffect(() => {
    // console.log("Tasks have been updated:", tasks);
  }, [tasks]);

  return (
    <div className="max-w-3xl mx-auto flex justify-between items-center px-8 mt-10">
      <h1 className="text-2xl font-semibold text-purple">TeachMate<span className="font-semibold text-orange">AI</span><span className="text-sm ml-1 text-black">Task manager</span></h1>
      <Dialog>
        <DialogTrigger>
          <Button className="font-semibold bg-purple hover:bg-purple/80 text-white">Create new task</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
            <DialogDescription>
              Create a new task. Click &apos;Add task&apos; when you&apos;re done.
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
            <Button type="submit" className="font-semibold bg-purple hover:bg-purple/80 text-white" onClick={() => handleCreateTask()}>
              Add task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
