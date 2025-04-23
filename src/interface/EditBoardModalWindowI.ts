import { BoxData } from "../types/BoxDataType";

export interface EditBoardModalWindowI {
  isVisible: boolean;
  onClose: () => void;
  onSave: (newBoard: BoxData) => void;
  id: string;
}
