import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import type { TaskSection, Id, Task } from "~/utils/types";
import { PlusIcon, TrashIcon } from "lucide-react";
import { api } from "~/utils/api";
import { useDebounce } from "@uidotdev/usehooks";

interface Props {
  column: TaskSection;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}

function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const {mutate} = api.tasks.updateTasksPlacements.useMutation();
  const tasksIds = useMemo(() => {
    const newTasksIds= tasks.map((task) => task.id);
    return newTasksIds;
  }, [tasks]);
  const debouncedTaskIds = useDebounce(tasksIds, 1000);
  
  const handleMutate = ()=>{
    void mutate({
      taskSectionId: column.id,
      tasks:tasksIds,
    })
  }

  useEffect(() => {
    handleMutate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTaskIds])
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
      bg-columnBackgroundColor
      flex
      h-[500px]
      max-h-[500px]
      w-[350px]
      flex-col
      rounded-md
      border-2
      border-pink-500
      opacity-40
      "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
  flex
  h-[550px]
  max-h-[550px]
  w-[350px]
  flex-col
  rounded-md
  "
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          if (column.title !== "No section") {
            setEditMode(true);
          }
        }}
        className="
      bg-mainBackgroundColor
      text-md
      border-columnBackgroundColor
      flex
      h-[60px]
      cursor-grab
      items-center
      justify-between
      rounded-md
      rounded-b-none
      border-4
      p-3
      font-bold
      "
      >
        <div className="flex gap-2">
          <div
            className="
        bg-columnBackgroundColor
        flex
        items-center
        justify-center
        rounded-full
        px-2
        py-1
        text-sm
        "
          >
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="rounded border-2 px-2 outline-none focus:border-blue-400"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        {column.title !== "No section" && (
          <button
            onClick={() => {
              deleteColumn(column.id);
            }}
            className="
        hover:bg-columnBackgroundColor
        rounded
        stroke-gray-500
        px-1
        py-2
        hover:stroke-white
        "
          >
            <TrashIcon />
          </button>
        )}
      </div>

      {/* Column task container */}
      <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden p-2">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className="border-columnBackgroundColor border-x-columnBackgroundColor hover:bg-mainBackgroundColor flex items-center gap-2 rounded-md border-2 p-4 hover:text-new active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcon />
        Add task
      </button>
    </div>
  );
}

export default ColumnContainer;
