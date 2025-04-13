import { makeAutoObservable } from "mobx";

class ItemStrore {
  items: string[] = [];

  constructor() {
    const saved = localStorage.getItem("items");
    this.items = saved ? JSON.parse(saved) : ["all", "current", "done"];
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
}

export const itemsStore = new ItemStrore();
