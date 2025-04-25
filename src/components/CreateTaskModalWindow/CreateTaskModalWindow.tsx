import { createPortal } from "react-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreateTaskModalWindowI } from "../../interface/CreateTaskModalWindowI";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { itemsStore } from "../../stores/itemStore";

export function CreateTaskModalWindow({
  isVisible,
  onClose,
  onSave,
}: CreateTaskModalWindowI) {
  const boards = itemsStore.getItems()!;
  const menuBoards = (boards as { id: string; title: string }[]).map(
    ({ id, title }) => ({ id, title })
  );

  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskData, setNewTaskData] = useState<string>("");
  const [newPriority, setNewPriority] = useState("Низкий");

  const commonStyles = {
    color: "white",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgb(0, 85, 255)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgb(0, 85, 255)",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
  };

  const handleSave = () => {
    const newTask = {
      boardId: selectedBoardId,
      taskTitle: newTaskTitle,
      taskDescription: newTaskDescription,
      taskData: newTaskData,
      taskPriority: newPriority,
    };
    onSave(newTask);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <Box
            component={motion.div}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            sx={{
              backgroundColor: "#1e1e2f",
              borderRadius: "12px",
              padding: "32px",
              width: "100%",
              maxWidth: "600px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              color: "white",
            }}
          >
            <FormControl fullWidth sx={{ ...commonStyles }}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  type="text"
                  id="task-title"
                  label="Введите название задачи"
                  placeholder="Почистить зубы..."
                  autoComplete="off"
                  sx={{
                    input: { color: "white" },
                    label: { color: "rgb(255, 255, 255)" },
                  }}
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  fullWidth
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <TextField
                  type="text"
                  id="task-description"
                  label="Введите описание задачи"
                  sx={{
                    input: { color: "white" },
                    label: { color: "rgb(255, 255, 255)" },
                  }}
                  autoComplete="off"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  fullWidth
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <TextField
                  type="date"
                  id="task-date"
                  placeholder="Дата выполнения"
                  variant="outlined"
                  sx={{
                    input: { color: "white" },
                  }}
                  value={newTaskData}
                  onChange={(e) => setNewTaskData(e.target.value)}
                  fullWidth
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth sx={{ ...commonStyles, mb: 2 }}>
                  <InputLabel
                    id="board-select-label"
                    sx={{
                      color: "white",
                      "&.Mui-focused": {
                        color: "white",
                      },
                    }}
                  >
                    Выберите доску
                  </InputLabel>
                  <Select
                    labelId="board-select-label"
                    id="board-select"
                    value={selectedBoardId}
                    label="Выберите доску"
                    onChange={(e) => setSelectedBoardId(e.target.value)}
                    sx={{
                      ...commonStyles,
                      mt: 1,
                    }}
                    fullWidth
                  >
                    {menuBoards.map(({ id, title }) => (
                      <MenuItem key={id} value={id}>
                        {title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </FormControl>

            <FormControl fullWidth sx={{ ...commonStyles, mb: 3 }}>
              <InputLabel
                id="priority-select-label"
                sx={{
                  color: "white",
                  "&.Mui-focused": {
                    color: "white",
                  },
                }}
              >
                Приоритет
              </InputLabel>
              <Select
                labelId="priority-select-label"
                id="priority-select"
                label="Приоритет"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                sx={{
                  ...commonStyles,
                  mt: 1,
                }}
              >
                <MenuItem value="Низкий">Низкий</MenuItem>
                <MenuItem value="Средний">Средний</MenuItem>
                <MenuItem value="Высокий">Высокий</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button variant="outlined" onClick={onClose}>
                Отмена
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Сохранить
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </AnimatePresence>,
    document.body
  );
}
