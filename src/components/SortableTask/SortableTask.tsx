import { TaskI } from "../../interface/TaskI";
import { Box, Typography, Button } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { useDndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { useEffect } from "react";

export function SortableTask({ task }: Readonly<{ task: TaskI }>) {
  const id = task.taskId;
  const boardId = task.boardId;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "task",
      boardId: boardId,
    },
  });

  const { active } = useDndContext();
  console.log(active);
  useEffect(() => {
    if (isDragging) {
      document.body.style.overflow = "hidden";
      document.body.style.userSelect = "none"; // Предотвращаем выделение текста
    } else {
      document.body.style.overflow = "";
      document.body.style.userSelect = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  return (
    <Box
      ref={setNodeRef}
      key={task.taskId}
      data-type="task"
      data-board-id={task.boardId}
      sx={{
        transform: CSS.Translate.toString(transform),
        transition,
        backgroundColor: isDragging ? "rgba(0,0,0,0.1)" : "#fff",
        border: "1px solid #ddd",
        borderRadius: 2,
        padding: 2,
        boxShadow: isDragging ? 3 : 1,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        position: "relative",
        zIndex: isDragging ? 1000 : 1,
        touchAction: "none", // Важно для мобильных устройств
        "&:not(:active)": {
          transition: "box-shadow 0.2s ease", // Плавное исчезновение тени
        },
        "&:hover:not(:active)": {
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          transform: "translateY(-2px)",
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
        <Button
          {...listeners}
          {...attributes}
          sx={{
            cursor: isDragging ? "grabbing" : "grab",
            minWidth: "auto",
            p: 0.5,
            color: "black",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.15)",
            },
          }}
        >
          <DragHandleIcon fontSize="small" />
        </Button>
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
  );
}
