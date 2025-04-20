import { Box, Button } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoxData } from "../../types/BoxDataType";
import { useDndContext } from "@dnd-kit/core";

export function SortableBox({ id, title, color }: Readonly<BoxData>) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const { active } = useDndContext();
  const isActive = active?.id === id;
  return (
    <Box
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        margin: "10px",
        padding: "5px",
        color: "white",
        borderRadius: "12px",
        width: "250px",
        background: color,
        zIndex: isActive ? 10 : 1,
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {" "}
      <Button
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        sx={{
          cursor: "grab",
          transition,
          width: "10px",
        }}
      ></Button>
      <h2>{title}</h2>
    </Box>
  );
}
