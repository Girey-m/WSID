import { DragEndEvent } from "@dnd-kit/core";

export interface DragAndDropLayoutI {
  onDragEnd: (event: DragEndEvent) => void;
  children: React.ReactNode;
}
