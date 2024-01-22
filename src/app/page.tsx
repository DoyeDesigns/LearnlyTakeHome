'use client'

import Image from "next/image";
import DemoPage from "@/components/TasksTableList/tasksTable";
import CreateTask from "@/components/createTask";
import store from "@/state/store";
import { Provider } from "react-redux";

export default function Home() {
  return (
      <main>
        <Provider store={store}>
          <CreateTask />
          <DemoPage />
        </Provider>
      </main>
  );
}

