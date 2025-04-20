import type { BoxData } from "../../types/BoxDataType";
import { itemsStore } from "../../stores/itemStore";

export function AddBoard(
  newBoard: BoxData,
  setBoard: React.Dispatch<React.SetStateAction<BoxData[]>>
) {
  setBoard((prevBoard) => [...prevBoard, newBoard]);
  itemsStore.addItem(newBoard.title);
}
