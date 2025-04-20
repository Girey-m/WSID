import { BoxData } from "../types/BoxDataType";
export interface AddBoardModalWindowI {
  isVisible: boolean;
  onClose: () => void;
  onSave: (newBoard: BoxData) => void; // Исправлено
}
