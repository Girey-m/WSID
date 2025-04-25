import { TaskI } from "../../interface/TaskI";
import { addTask } from "../../services/IndexDBUtils";

export function CreateTask(newTask: TaskI) {
  addTask(newTask);
}
