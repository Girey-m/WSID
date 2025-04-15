import { Box } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoxData } from "../../types/BoxDataType";
import { useDndContext } from "@dnd-kit/core";

export function SortableBox({ id, title, color }: Readonly<BoxData>) {
  console.log(useSortable({ id }), 'ID');
  console.log(id, 'ID22');
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const { active } = useDndContext();
  const isActive = active?.id === id;
  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        margin: "10px",
        padding: "20px",
        color: "white",
        borderRadius: "12px",
        textAlign: "center",
        cursor: "grab",
        width: "250px",
        background: color,
        zIndex: isActive ? 10 : 1,
        position: "relative",
      }}
    >
      <h2>{title}</h2>
    </Box>
  );
}
