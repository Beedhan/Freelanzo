import { useEffect, useMemo, useState } from "react";
import type { Id, Task, TaskSection } from "~/utils/types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { PlusIcon } from "lucide-react";
import { api } from "~/utils/api";
import { createId } from "@paralleldrive/cuid2";
import { useDebounce } from "@uidotdev/usehooks";
type KanbanBoardProps = {
  originalTasks: Task[];
  tasks: Task[];
  setTaskSections: React.Dispatch<React.SetStateAction<TaskSection[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  tasksSection: TaskSection[];
  originalSections: TaskSection[];
  projectId: string;
};
function KanbanBoard({
  tasks,
  tasksSection: columns,
  setTasks,
  setTaskSections: setColumns,
  projectId,
  originalTasks,
  originalSections,
}: KanbanBoardProps) {
  const columnsId = useMemo(() => columns.map((col) => col?.id), [columns]);
  const debouncedTaskIds = useDebounce(columnsId, 1000);

  const [activeColumn, setActiveColumn] = useState<TaskSection | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const util = api.useContext();
  const {mutate} = api.tasks.updateSectionsPlacements.useMutation();

  const handleMutate = ()=>{
    void mutate({
      projectId,
      taskSections:columnsId,
    })
  }
  useEffect(() => {
    handleMutate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTaskIds])
  
  const taskSectionMutation = api.tasks.createSection.useMutation({
    onSuccess: () => {
      void util.tasks.invalidate();
    },
  });
  const taskSectionUpdateMutation = api.tasks.updateSection.useMutation({
    onSuccess: () => {
      void util.tasks.invalidate();
    },
  });
  const taskSectionDeleteMutation = api.tasks.deleteSection.useMutation({
    onSuccess: () => {
      void util.tasks.invalidate();
    },
  });
  const taskMutation = api.tasks.create.useMutation({
    onSuccess: () => {
      void util.tasks.invalidate();
    },
  });
  const taskUpdateMutation = api.tasks.update.useMutation({
    onSuccess: () => {
      void util.tasks.invalidate();
    },
  });
  const taskDeleteMutation = api.tasks.delete.useMutation({
    onSuccess: () => {
      void util.tasks.invalidate();
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <div
      className="
       flex
        min-h-screen
        w-full
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
        py-6
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className=" flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.taskSectionId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="
      ring-new
      flex
      h-[60px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      gap-2
      rounded-lg
      border-2
      p-4
      hover:ring-2
      "
          >
            <PlusIcon />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.taskSectionId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId: Id) {
    const id = generateId();
    const newTask: Task = {
      id,
      taskSectionId: columnId,
      title: `New Task`,
    };
    taskMutation.mutate({
      projectId,
      title: `New Task`,
      id,
      taskSectionId: columnId,
    });
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    taskDeleteMutation.mutate({
      projectId,
      id,
    });
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, title: content };
    });
    taskUpdateMutation.mutate({
      projectId,
      title: content,
      id,
    });
    setTasks(newTasks);
  }

  function createNewColumn() {
    const id = generateId();
    const columnToAdd: TaskSection = {
      id,
      title: `New Section ${columns.length + 1}`,
    };
    taskSectionMutation.mutate({
      projectId,
      title: `New Section ${columns.length + 1}`,
      id,
    });
    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.taskSectionId !== id);
    setTasks(newTasks);
    taskSectionDeleteMutation.mutate({
      projectId,
      id,
    });
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    taskSectionUpdateMutation.mutate({
      projectId,
      title,
      id,
    });
    setColumns(newColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (
          tasks[activeIndex]?.taskSectionId != tasks[overIndex]?.taskSectionId
        ) {
          // Fix introduced after video recording
          tasks[activeIndex].taskSectionId = tasks[overIndex].taskSectionId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].taskSectionId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return createId();
}

export default KanbanBoard;
