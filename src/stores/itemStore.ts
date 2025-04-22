import { makeAutoObservable } from "mobx";
import type { BoxData } from "../types/BoxDataType";
import { initialBoxes } from "../constants/initialBoxes";

class ItemStore {
  items: BoxData[] = [];

  constructor() {
    const saved = localStorage.getItem("items");
    console.log("Загрузка из localStorage:", saved); // debug
    try {
      this.items = saved ? JSON.parse(saved) : initialBoxes;
    } catch (error) {
      console.error("Failed to load items from localStorage", error);
      this.items = initialBoxes;
    }

    makeAutoObservable(this);
  }

  moveItem(oldIndex: number, newIndex: number) {
    const moved = [...this.items];
    const [removed] = moved.splice(oldIndex, 1);
    moved.splice(newIndex, 0, removed);
    this.items = moved;
    localStorage.setItem("items", JSON.stringify(this.items));
  }

  setItems(items: BoxData[]) {
    this.items = items;
    localStorage.setItem("items", JSON.stringify(this.items));
  }

  addItem(item: BoxData) {
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

  deleteItem(id: string) {
    const currentItems = [...this.items];
    const deleteIndex = currentItems.findIndex((item) => item.id === id);
    if (deleteIndex !== -1) {
      currentItems.splice(deleteIndex, 1);
      this.items = currentItems;
      localStorage.setItem("items", JSON.stringify(this.items));
    }
  }
}

export const itemsStore = new ItemStore();
