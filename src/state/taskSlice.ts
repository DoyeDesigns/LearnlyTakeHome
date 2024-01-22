import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "@firebase/firestore";
import { RootState } from "./store";
import { toast } from "react-toastify";

const success = () => toast.success("Task completed!");
const failed = () => toast.error("Failed to mark task as completed!");

interface Task {
  id: string;
  title: string;
  description: string;
  date: Date | undefined;
  status: "pending" | "completed" | "Overdue";
}

interface TaskState {
  list: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TaskState = {
  list: [],
  status: "idle",
  error: null,
};

// fetching data from firebase
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  try {
    const docRef = collection(db, "Tasks");
    const querySnapshot = await getDocs(docRef);

    const tasksData: Task[] = [];
    querySnapshot.forEach((doc) => {
      const task: Task = {
        id: doc.id,
        title: doc.data().title,
        status: doc.data().status,
        description: doc.data().description,
        date: doc.data().date?.toDate(),
      };

      tasksData.push(task);
    });

    return tasksData;
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    throw error;
  }
});

// deleting a task in firebase
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    try {
      const docRef = doc(db, "Tasks", taskId);
      await deleteDoc(docRef);

      return taskId;
    } catch (error) {
      console.error("Error deleting task: ", error);
      throw error;
    }
  }
);

// updating the state of a task in firebase
export const completeTask = createAsyncThunk(
  "tasks/completeTask",
  async (taskId: string) => {
    try {
      const docRef = doc(db, "Tasks", taskId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        // Document exists, proceed with the update
        await updateDoc(docRef, { status: "completed" });

        success()

        return taskId;
      } else {
        // Document doesn't exist
        console.error("Document does not exist:", taskId);
      }
    } catch (error) {
      console.error("Error completing task: ", error);
      failed()
    }
  }
);

// exporting the redux state
export const selectTasks = (state: RootState) => state.tasks;

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      const newTask = action.payload;
      console.log("Action Payload:", newTask);
      state.list.push(newTask);
    },
    editTask: (
      state,
      action: PayloadAction<{
        id: string;
        title: string;
        description: string;
        date: Date | undefined;
      }>
    ) => {
      const { id, title, description, date } = action.payload;
      const existingTask = state.list.find((task) => task.id === id);
      if (existingTask) {
        existingTask.title = title;
        existingTask.description = description;
        existingTask.date = date;
      }
    },
    deleteTaskLocally: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      state.list = state.list.filter((task) => task.id !== taskId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch tasks";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const deletedTaskId = action.payload;
        state.status = "succeeded";
        state.list = state.list.filter((task) => task.id !== deletedTaskId);
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        const taskId = action.payload;
        const existingTask = state.list.find((task) => task.id === taskId);
        if (existingTask) {
          existingTask.status = "completed";
        }
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to complete task";
      });
  },
});

export const { addTask, editTask, deleteTaskLocally } = taskSlice.actions;
export default taskSlice.reducer;
