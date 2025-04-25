import { TaskI } from "./TaskI";

export interface CreateTaskModalWindowI {
  isVisible: boolean;
  onClose: () => void;
  onSave: (newTask: TaskI) => void;
}
