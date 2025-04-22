import { createPortal } from "react-dom";
import { Container, TextField, Button, Box } from "@mui/material";
import { AddBoardModalWindowI } from "../../interface/AddBoardModalWindowI";
import { useState, useEffect } from "react";

export function AddBoardModalWindow({
  isVisible,
  onClose,
  onSave,
}: AddBoardModalWindowI) {
  const [boardName, setBoardName] = useState("Новая доска");
  const [boardId, setBoardId] = useState("");
  const [boardColor, setBoardColor] = useState("#0d09b6");

  useEffect(() => {
    const generatedId =
      boardName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || "board-" + Date.now();

    setBoardId(generatedId);
  }, [boardName]);

  const handleSave = () => {
    const newBoard = {
      id: boardId,
      title: boardName,
      color: boardColor,
    };
    onSave(newBoard);
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
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        fullWidth
      />

      <TextField
        label="ID доски"
        value={boardId}
        onChange={(e) => setBoardId(e.target.value)}
        fullWidth
        helperText="Автоматически генерируется из названия"
      />

      <TextField
        label="Цвет доски"
        type="color"
        value={boardColor}
        onChange={(e) => setBoardColor(e.target.value)}
        fullWidth
        sx={{
          style: {
            height: "50px",
            padding: "5px",
          },
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Отмена
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Сохранить
        </Button>
      </Box>
    </Container>,
    document.body
  );
}
