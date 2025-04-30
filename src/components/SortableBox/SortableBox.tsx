import { Box, Button, Typography } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoxData } from "../../types/BoxDataType";
import { useDndContext } from "@dnd-kit/core";
import DragHandleIcon from "@mui/icons-material/DragHandle";

import { ActionMenuBtn } from "../ActionMenuBtn/ActionMenuBtn";
import { TaskList } from "../TaskList/TaskList";

export function SortableBox({ id, title, color }: Readonly<BoxData>) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, data: { type: "board" } });
  const { active } = useDndContext();
  const isActive = active?.id === id;

  return (
    <Box
      ref={setNodeRef}
      data-type={{ type: "column" }}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        margin: 0,
        padding: 0,
        color: "white",
        borderRadius: 2,
        width: 250,
        background: color,
        zIndex: isActive ? 10 : 1,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        gap: 1.5,
        boxShadow: isActive ? 3 : 1,
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          width: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "10px",
          paddingLeft: "0",
          paddingRight: "0",
          gap: 1.5,
          boxShadow: "0 2px 8px 1px  black",
        }}
      >
        <Button
          {...listeners}
          {...attributes}
          sx={{
            cursor: isActive ? "grabbing" : "grab",
            minWidth: "auto",
            p: 0.5,
            color: "inherit",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.15)",
            },
          }}
        >
          <DragHandleIcon fontSize="small" />
        </Button>

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            userSelect: "none",
            fontWeight: 500,
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            fontSize: "16px",
          }}
        >
          {title}
        </Typography>
        <ActionMenuBtn id={id} />
      </Box>
      <TaskList id={id} color={color} />
    </Box>
  );
}
