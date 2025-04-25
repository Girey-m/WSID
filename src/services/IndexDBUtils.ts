import { DB_NAME, DB_VERSION, STORE_NAME } from "../constants/indexDB";

export function openDB(): Promise<IDBDatabase> {
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
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error("Ошибка при открытии базы данных"));
    };
  });
}

export function addTask(task: {
  boardId: string;
  taskTitle: string;
  taskDescription: string;
  taskData: string;
  taskPriority: string;
}): Promise<number> {
  return new Promise((resolve, reject) => {
    openDB()
      .then((db) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(task);

        request.onsuccess = () => resolve(request.result as number);
        request.onerror = () =>
          reject(new Error("Ошибка при добавлении задачи"));
      })
      .catch(reject);
  });
}
