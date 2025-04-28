export interface TaskI {
  boardId: string;
  id?: number;
  taskId: number;
  taskTitle: string;
  taskDescription: string;
  taskData: string;
  taskPriority: string;
  order: number;
}
