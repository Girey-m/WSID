import { createPortal } from "react-dom";
import { EditBoardModalWindowI } from "../../interface/EditBoardModalWindowI";
import { useState, useEffect } from "react";

import { Box, TextField, Button, Container } from "@mui/material";
import { itemsStore } from "../../stores/itemStore";

export function EditBoardModalWindow({
  isVisible,
  onClose,
  onSave,
  id,
}: EditBoardModalWindowI) {
  const [boardTitle, setBoardTitle] = useState("");
  const [boardColor, setBoardColor] = useState("");

  useEffect(() => {
    if (isVisible) {
      const editedBoard = itemsStore.findItem(id);
      if (editedBoard) {
        setBoardTitle(editedBoard.title);
        setBoardColor(editedBoard.color);
      }
    }
  }, [id, isVisible]);

  const saveClick = () => {
    onSave({ id, title: boardTitle, color: boardColor });
    onClose();
  };

  if (!isVisible) return null;

  return createPortal(
    <Container
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: 3,
        borderRadius: 2,
        boxShadow: 24,
        zIndex: 1300,
        minWidth: 400,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        label="Название доски"
        value={boardTitle}
        onChange={(e) => setBoardTitle(e.target.value)}
      />

      <TextField
        label="Цвет доски"
        type="color"
        value={boardColor}
        onChange={(e) => setBoardColor(e.target.value)}
        sx={{
          style: {
            height: "50px",
            padding: "5px",
          },
        }}
      />

      <Box>
        <Button variant="outlined" onClick={onClose}>
          Отмена
        </Button>
        <Button variant="contained" onClick={saveClick}>
          Сохранить
        </Button>
      </Box>
    </Container>,
    document.body
  );
}
