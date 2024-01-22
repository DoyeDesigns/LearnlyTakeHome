import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/state/store";
import { DataTableDemo } from "./dataTable"; // Adjust the path based on your project structure
import { fetchTasks, selectTasks } from "@/state/taskSlice";

export default function DemoPage() {
  // access application state from taskSlice
  const dispatch: AppDispatch = useDispatch();
  const { list, status, error } = useSelector(selectTasks);

  // tracking state of data being fetched
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [dispatch, status]);

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTableDemo data={list} />
    </div>
  );
}
