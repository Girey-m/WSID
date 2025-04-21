import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { AddBoardModalWindowBtnProps } from "../../interface/AddBoardModalWindowBtnProps";

// Компонент кнопки
export function AddBoardModalWindowBtn({
  openModal,
}: Readonly<AddBoardModalWindowBtnProps>) {
  return (
    <Button
      onClick={openModal}
      variant="contained"
      color="primary"
      startIcon={<EditIcon sx={{ transform: "scale(1.5)" }} />}
    >
      Создать доску задач
    </Button>
  );
}
