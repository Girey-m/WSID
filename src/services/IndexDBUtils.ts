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
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });

        // Вот он — спасительный индекс
        store.createIndex("boardId", "boardId", { unique: false });
      } else {
        const store = (
          event.target as IDBOpenDBRequest
        ).transaction!.objectStore(STORE_NAME);

        if (!store.indexNames.contains("boardId")) {
          store.createIndex("boardId", "boardId", { unique: false });
        }
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

// ... существующий код ...

export function updateTask(
  taskId: number,
  updates: Partial<TaskI>
): Promise<void> {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(taskId);

      request.onsuccess = () => {
        const existingTask = request.result;
        if (!existingTask) {
          reject(new Error("Задача не найдена"));
          return;
        }

        const updatedTask = { ...existingTask, ...updates };
        const putRequest = store.put(updatedTask);

        putRequest.onsuccess = () => {
          taskEventBus.emit();
          resolve();
        };

        putRequest.onerror = () =>
          reject(new Error("Ошибка при обновлении задачи"));
      };

      request.onerror = () => reject(new Error("Ошибка при поиске задачи"));
    });
  });
}

export function reorderTasksInBoard(
  boardId: string,
  newOrder: number[]
): Promise<void> {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.index("boardId").getAll(boardId);

      request.onsuccess = async () => {
        const tasks = request.result as TaskI[];
        const taskMap = new Map(tasks.map((task) => [task.taskId, task]));

        try {
          for (let i = 0; i < newOrder.length; i++) {
            const taskId = newOrder[i];
            const task = taskMap.get(taskId);
            if (task) {
              task.order = i;
              await new Promise<void>((res, rej) => {
                const updateRequest = store.put(task);
                updateRequest.onsuccess = () => res();
                updateRequest.onerror = () => rej();
              });
            }
          }
          taskEventBus.emit();
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      request.onerror = () => reject(new Error("Ошибка при получении задач"));
    });
  });
}
