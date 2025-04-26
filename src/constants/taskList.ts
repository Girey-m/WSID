import { getAllTasks } from "../services/IndexDBUtils";

export const taskList = async () => {
  return await getAllTasks();
};
