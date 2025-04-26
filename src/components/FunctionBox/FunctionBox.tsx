import { AddBoardModalWindowBtn } from "../AddBoardModalWindowBtn/AddBoardModalWindowBtn";
import { AddBoardModalWindow } from "../AddBoardModalWindow/AddBoardModalWindow";
import { AddBoard } from "../AddBoard/AddBoard";
import { CreateTaskBtn } from "../CreateTaskBtn/CreateTaskBtn";
import { CreateTask } from "../CreateTask/CreateTask";
import { CreateTaskModalWindow } from "../CreateTaskModalWindow/CreateTaskModalWindow";
import { Box } from "@mui/material";
import { useState } from "react";
import { BoxData } from "../../types/BoxDataType";
import { TaskI } from "../../interface/TaskI";
import { getAllTasks } from "../../services/IndexDBUtils";

export function FunctionBox() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const handleSaveBoard = (newBoard: BoxData) => {
    AddBoard(newBoard);
  };

  const handleSaveTask = async (newTask: TaskI) => {
    try {
      CreateTask(newTask);
      const allTasks = await getAllTasks();
      console.log("Задача успешно добавлена:", newTask);

      console.log("Все задачи после добавления:", allTasks);
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <AddBoardModalWindowBtn openModal={() => setIsModalOpen(true)} />
      <AddBoardModalWindow
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBoard}
      />
      <CreateTaskBtn openModal={() => setCreateTaskOpen(true)} />
      <CreateTaskModalWindow
        isVisible={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        onSave={handleSaveTask}
      />
    </Box>
  );
}
