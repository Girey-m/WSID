import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";

import { DragAndDropLayoutI } from "../../interface/DragAndDropLayoutI";

export function DragAndDropLayout({
  onDragEnd,
  children,
}: Readonly<DragAndDropLayoutI>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      {children}
    </DndContext>
  );
}
