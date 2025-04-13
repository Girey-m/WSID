import { DragEndEvent } from "@dnd-kit/core";

export interface DragAndDropLayoutI {
  onDragEnd: (event: DragEndEvent) => void; // Исправлен тип аргумента
  children: React.ReactNode;
}
