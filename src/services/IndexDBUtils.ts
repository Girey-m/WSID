import { DB_NAME, DB_VERSION, STORE_NAME } from "../constants/indexDB";
import { TaskI } from "../interface/TaskI";
import { taskEventBus } from "./EventBus"; // Импортируем EventBus

// Глобальная переменная для базы данных
let dbInstance: IDBDatabase | null = null;

export function openDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance); // Уже есть открытая база? Вернем её!
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result; // Сохраняем открытый экземпляр
      resolve(dbInstance);
    };

    request.onerror = () => {
      reject(new Error("Ошибка при открытии базы данных"));
    };
  });
}

export function addTask(task: {
  boardId: string;
  taskId: number;
  taskTitle: string;
  taskDescription: string;
  taskData: string;
  taskPriority: string;
  order: number;
}): Promise<number> {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(task);

      request.onsuccess = () => {
        taskEventBus.emit(); // Генерируем событие при добавлении задачи
        resolve(request.result as number);
      };

      request.onerror = () => reject(new Error("Ошибка при добавлении задачи"));
    });
  });
}

export function deleteTasksByBoardId(boardId: string): Promise<void> {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const task = cursor.value;
          if (task.boardId === boardId) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          taskEventBus.emit(); // Генерируем событие после удаления задачи
          resolve();
        }
      };

      request.onerror = () => {
        reject(new Error("Ошибка при удалении задач по boardId"));
      };
    });
  });
}

export function getAllTasks(): Promise<TaskI[]> {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as TaskI[]);
      request.onerror = () =>
        reject(new Error("Ошибка при получении всех задач"));
    });
  });
}
