import { DragEndEvent } from "@dnd-kit/core";
import { itemsStore } from "../stores/itemStore";
import {
  updateTask,
  getAllTasks,
  reorderTasksInBoard,
} from "../services/IndexDBUtils";
import { taskEventBus } from "../services/EventBus";

export function useHandleDragEnd() {
  return async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // === 1. Перемещение колонок ===
    if (
      active.data.current?.type === "board" &&
      over.data.current?.type === "board"
    ) {
      const oldIndex = itemsStore.items.findIndex(
        (item) => item.id === String(active.id)
      );
      const newIndex = itemsStore.items.findIndex(
        (item) => item.id === String(over.id)
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        itemsStore.moveItem(oldIndex, newIndex);
      }
      return;
    }

    // === 2. Перемещение задач ===
    if (
      active.data.current?.type === "task" &&
      over.data.current?.type === "task"
    ) {
      const taskId = Number(active.id); // id таски
      const newBoardId = over.data.current.boardId; // куда кидаем
      const oldBoardId = active.data.current.boardId; // откуда взяли

      try {
        const allTasks = await getAllTasks();

        // === Перемещение в другую колонку ===
        if (oldBoardId !== newBoardId) {
          const newBoardTasks = allTasks
            .filter((t) => t.boardId === newBoardId)
            .sort((a, b) => a.order - b.order);

          const newOrder = newBoardTasks.length;

          await updateTask(taskId, {
            boardId: newBoardId,
            order: newOrder,
          });

          taskEventBus.emit(); // перерендер
          return;
        }

        // === Перемещение внутри одной колонки ===
        const boardTasks = allTasks
          .filter((t) => t.boardId === newBoardId)
          .sort((a, b) => a.order - b.order);

        const oldIndex = boardTasks.findIndex((t) => t.taskId === taskId);
        const overIndex = boardTasks.findIndex(
          (t) => t.taskId === Number(over.id)
        );

        if (oldIndex === -1 || overIndex === -1) {
          console.warn("Не удалось найти индексы задач");
          return;
        }

        const newOrder = [...boardTasks.map((t) => t.taskId)];
        const [removed] = newOrder.splice(oldIndex, 1);
        newOrder.splice(overIndex, 0, removed);

        await reorderTasksInBoard(newBoardId, newOrder);
        taskEventBus.emit();
      } catch (error) {
        console.error("Ошибка при перемещении задачи:", error);
      }
    }
  };
}
