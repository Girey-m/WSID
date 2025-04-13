import { DragEndEvent } from "@dnd-kit/core";
import { itemsStore } from "../stores/itemStore";

export function useHandleDragEnd() {
  return (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id) {
      const oldIndex = itemsStore.items.indexOf(String(active.id));
      const newIndex = itemsStore.items.indexOf(String(over.id));

      if (oldIndex !== -1 && newIndex !== -1) {
        itemsStore.moveItem(oldIndex, newIndex);
      }
    }
  };
}
