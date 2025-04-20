import { makeAutoObservable } from "mobx";

class ItemStore {
  items: string[] = [];

  constructor() {
    const saved = localStorage.getItem("items");
    console.log("Загрузка из localStorage:", saved); // debug
    try {
      this.items = saved ? JSON.parse(saved) : ["all", "current", "done"];
    } catch (error) {
      console.error("Failed to load items from localStorage", error);
      this.items = ["all", "current", "done"];
    }

    makeAutoObservable(this);
  }

  moveItem(oldIndex: number, newIndex: number) {
    const moved = [...this.items];
    const [removed] = moved.splice(oldIndex, 1); // теперь точно удаляет
    moved.splice(newIndex, 0, removed); // и вставляем на новое место
    this.items = moved;
    localStorage.setItem("items", JSON.stringify(this.items));
  }

  setItems(items: string[]) {
    this.items = items;
    localStorage.setItem("items", JSON.stringify(this.items));
  }

  addItem(item: string) {
    if (this.items.includes(item)) {
      console.warn("Попытка добавить дубликат:", item);
      return;
    }
    const currentItems = [...this.items];
    currentItems.splice(0, 0, item);
    this.items = currentItems;
    console.log("Сохраняем в localStorage:", currentItems);
    localStorage.setItem("items", JSON.stringify(this.items));
  }
}

export const itemsStore = new ItemStore();
