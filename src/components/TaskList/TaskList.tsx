import { getAllTasks } from "../../services/IndexDBUtils";
import { taskEventBus } from "../../services/EventBus";
import { TaskI } from "../../interface/TaskI";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import {
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { SortableTask } from "../SortableTask/SortableTask";

export function TaskList({
  id,
  color,
}: Readonly<{ id: string; color: string }>) {
  const [tasks, setTasks] = useState<TaskI[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const allTasks = await getAllTasks();
      const filtered = allTasks
        .filter((task) => task.boardId === id)
        .sort((a, b) => a.order - b.order); // 🛠 сортировка по порядку!
      setTasks(filtered);
    };

    fetchTasks();

    const unsubscribe = taskEventBus.subscribe(() => {
      fetchTasks();
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const filteredTasks = tasks.filter((task) => task.boardId === id);

  return (
    <SortableContext
      id={id}
      items={filteredTasks.map((task) => task.taskId)}
      strategy={verticalListSortingStrategy}
    >
      <Box
        data-id={`${id}-${color}`}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 2,
          height: "100%",
          justifyContent: "flex-start",
          overflowY: "visible",
        }}
      >
        {filteredTasks.map((task) => (
          <SortableTask key={task.taskId} task={task} />
        ))}
      </Box>
    </SortableContext>
  );
}
