import { getAllTasks } from "../../services/IndexDBUtils";
import { taskEventBus } from "../../services/EventBus";
import { TaskI } from "../../interface/TaskI";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

export function TaskList({ id }: Readonly<{ id: string }>) {
  const [tasks, setTasks] = useState<TaskI[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const allTasks = await getAllTasks();
      setTasks(allTasks);
    };

    fetchTasks();

    const unsubscribe = taskEventBus.subscribe(() => {
      fetchTasks();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredTasks = tasks.filter((task) => task.boardId === id);

  return (
    <Box>
      {filteredTasks.map((task) => (
        <Box
          key={`${task.boardId}-${task.taskTitle}`}
          sx={{
            border: "1px solid grey",
            marginBottom: 1,
            padding: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6">{task.taskTitle}</Typography>
          <Typography variant="body2">{task.taskDescription}</Typography>
          <Typography variant="caption">{task.taskData}</Typography>
          <Typography variant="body2" color="primary">
            {task.taskPriority}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
