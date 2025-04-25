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
      sx={{ height: "50px", fontSize: "16px", width: "100%" }}
      startIcon={<EditIcon sx={{ transform: "scale(1.5)" }} />}
    >
      Создать доску задач
    </Button>
  );
}
