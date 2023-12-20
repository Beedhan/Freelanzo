"use client";
import React, { createContext } from "react";
import type{ Task, TaskSection } from "~/utils/types";

export type AppContextType = {
  activeSidebar: string;
  handleSidebar: (name: string) => void;
  tasksCopy:Task[];
  setTasksCopy:React.Dispatch<React.SetStateAction<Task[]>>;
  taskSectionsCopy:TaskSection[];
  setTaskSectionsCopy:React.Dispatch<React.SetStateAction<TaskSection[]>>;
};
export const AppContext = createContext<AppContextType>(null!);
export const AppProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [activeSidebar, setActiveSidebar] = React.useState("");
  const [tasksCopy, setTasksCopy] = React.useState<Task[]>([]);
  const [taskSectionsCopy, setTaskSectionsCopy] =
    React.useState<TaskSection[]>([]);
  const handleSidebar = (name: string) => {
    if (activeSidebar === name) {
      setActiveSidebar("");
    } else {
      setActiveSidebar(name);
    }
  };
  return (
    <AppContext.Provider value={{ activeSidebar, handleSidebar,tasksCopy,setTasksCopy,taskSectionsCopy,setTaskSectionsCopy }}>
      {children}
    </AppContext.Provider>
  );
};
