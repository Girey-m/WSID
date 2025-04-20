import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

// Компонент кнопки
export function AddBoardModalWindowBtn({
  openModal,
}: {
  openModal: () => void;
}) {
  return (
    <Button
      onClick={openModal}
      variant="contained"
      color="primary"
      startIcon={<EditIcon sx={{ transform: "scale(1.5)" }} />}
    >
      Открыть модальное окно
    </Button>
  );
}
