import { Box } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoxData } from "../../types/BoxDataType";

export function SortableBox({ id, title, color }: Readonly<BoxData>) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

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
      }}
    >
      <h2>{title}</h2>
    </Box>
  );
}
