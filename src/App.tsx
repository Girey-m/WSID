import { Container } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { autorun } from "mobx";

import { itemsStore } from "./stores/itemStore";
import { initialBoxes } from "./constants/initialBoxes";
import { SortableBox } from "./components/SortableBox/SortableBox";
import { DragAndDropLayout } from "./components/DragAndDropLayout/DragAndDropLayout";
import {
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useHandleDragEnd } from "./hooks/useHandleDragEnd";

export const App = observer(function App() {
  const handleDragEnd = useHandleDragEnd();
  console.log(useHandleDragEnd(), 'FUNC');

  useEffect(() => {
    const dispose = autorun(() => {
      localStorage.setItem("items", JSON.stringify(itemsStore.items));
    });
    return () => dispose();
  }, []);

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        background: "aqua",
        gap: 2,
        padding: 4,
      }}
    >
      <DragAndDropLayout onDragEnd={handleDragEnd}>
        <SortableContext
          items={itemsStore.items}
          strategy={verticalListSortingStrategy}
        >
          {itemsStore.items.map((id: string) => {
            const box = initialBoxes.find((b) => b.id === id)!;
            return (
              <SortableBox
                key={id}
                id={id}
                title={box.title}
                color={box.color}
              />
            );
          })}
        </SortableContext>
      </DragAndDropLayout>
    </Container>
  );
});
