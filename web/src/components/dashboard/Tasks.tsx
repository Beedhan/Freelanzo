"use client";
import React, { useContext, useState } from "react";
import { api } from "~/utils/api";
import { Task, TaskSection } from "~/utils/types";
import Kanban from "./kanban/KanbanBoard";
import { AppContext } from "~/context/AppContext";

const Tasks = ({ projectId }: { projectId: string }) => {
  const [sectionTitle, setSectionTitle] = useState("");
  const appContext = useContext(AppContext);
  const { data, refetch } = api.tasks.getTasks.useQuery(
    { projectId },
    {
      onSuccess(data) {
        appContext?.setTasksCopy(data.tasks);
        appContext?.setTaskSectionsCopy(data.taskSections);
      },
    }
  );
  const taskSectionMutation = api.tasks.createSection.useMutation({
    onSuccess() {
      setSectionTitle("");
      void refetch();
    },
  });
  // const handleAddSection = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   taskSectionMutation.mutate({
  //     projectId,
  //     title: sectionTitle,
  //   });
  // };
  return (
    <div className="mx-auto">
      {data && (
        <Kanban
          tasks={appContext?.tasksCopy}
          setTasks={appContext?.setTasksCopy}
          tasksSection={appContext?.taskSectionsCopy}
          setTaskSections={appContext?.setTaskSectionsCopy}
          projectId={projectId}
          originalTasks={data.tasks}
          originalSections={data.taskSections}
        />
      )}
    </div>
  );
};

export default Tasks;
