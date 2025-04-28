import { getAllTasks } from "../../services/IndexDBUtils";
import { useSortable } from "@dnd-kit/sortable";
import { taskEventBus } from "../../services/EventBus";
import { TaskI } from "../../interface/TaskI";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { DndContext, useDndContext } from "@dnd-kit/core";

export function TaskList({ id }: Readonly<{ id: string }>) {
  const [tasks, setTasks] = useState<TaskI[]>([]);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const { active } = useDndContext();

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
    <DndContext>
      <Box
        data-id={id}
        ref={setNodeRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 2,
          height: "100%",
          justifyContent: "flex-start",
          overflowY: "auto",
          transform: CSS.Transform.toString(transform),
          transition,
        }}
      >
        {filteredTasks.map((task) => (
          <Box
            {...listeners}
            {...attributes}
            key={task.taskId}
            data-board-id={task.boardId}
            sx={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: 2,
              padding: 2,
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle2" color="text.secondary">
                #{task.id}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {task.taskTitle}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.primary">
              {task.taskDescription}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption" color="text.secondary">
                {task.taskData}
              </Typography>
              <Typography variant="body2" color="primary.main" fontWeight={500}>
                {task.taskPriority}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </DndContext>
  );
}
