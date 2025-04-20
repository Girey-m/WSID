import { Box, Button, Typography } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoxData } from "../../types/BoxDataType";
import { useDndContext } from "@dnd-kit/core";
import DragHandleIcon from "@mui/icons-material/DragHandle";

export function SortableBox({ id, title, color }: Readonly<BoxData>) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const { active } = useDndContext();
  const isActive = active?.id === id;

  return (
    <Box
      ref={setNodeRef}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        margin: 2,
        padding: 2,
        color: "white",
        borderRadius: 2,
        width: 250,
        background: color,
        zIndex: isActive ? 10 : 1,
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        boxShadow: isActive ? 3 : 1,
        "&:hover": {
          boxShadow: 4,
        },
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
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}
