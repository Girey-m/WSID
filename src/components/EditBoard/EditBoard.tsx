import type { BoxData } from "../../types/BoxDataType";
import { itemsStore } from "../../stores/itemStore";

export function EditBoard(newBoard: BoxData) {
  itemsStore.editItem(newBoard);
}
