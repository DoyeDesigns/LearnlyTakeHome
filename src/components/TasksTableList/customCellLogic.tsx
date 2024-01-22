import { db } from "@/config/firebase";
import { AppDispatch, RootState } from "@/state/store";
import { completeTask, deleteTask, editTask } from "@/state/taskSlice";
import { deleteDoc, doc, setDoc } from "@firebase/firestore";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';

interface Task {
    id: string;
    title: string;
    description: string;
    date: Date | undefined;
    status: "pending" | "completed" | "Overdue";
  }

export const useCellLogic = (task: Task) => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [date, setDate] = React.useState<Date>();
  
    const dispatch: AppDispatch = useDispatch();
    const tasks = useSelector((state: RootState) => state.tasks.list);

    const success = () => toast.success("Successfully edited task!");
    const failed = () => toast.error("Failed to edit task, try again!");
    const deleted = () => toast.success("Task Deleted");
    const stubborn = () => toast.error("Failed to delete task, try again!")
  
    const handleEdit = () => {
      setTitle(task.title);
      setDescription(task.description);
      setDate(task.date);
    };
  
    const handleDelete = async () => {
      try {
        const docRef = doc(db, "Tasks", task.id);
        await deleteDoc(docRef);
        dispatch(deleteTask(task.id));

        // delete success message
        deleted()
      } catch (e) {
        console.error("Error deleting document: ", e);

        // delete failed message
        stubborn()
      }
    };
  
    const handleEditedChanges = async () => {
      try {
        const docRef = doc(db, "Tasks", task.id);
        const editedTask = {
          id: task.id,
          title: title,
          description: description,
          date: date,
        };
  
        await setDoc(docRef, editedTask);
        console.log("Document updated successfully!");

        // success message
        success()
  
        dispatch(editTask(editedTask));
  
        setTitle("");
        setDescription("");
        setDate(undefined);
      } catch (e) {
        console.error("Error updating document: ", e);
        // error message
        failed()
      }
    };
  
    const handleCompleteTask = async (taskId: string) => {
      try {
        await dispatch(completeTask(taskId));
      } catch (error) {
        console.error("Error completing task: ", error);
      }
    };
  
    React.useEffect(() => {
      console.log("Tasks have been updated:", tasks);
    }, [tasks]);
  
    return {
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
    };
  };

//   export default UseCellLogic;