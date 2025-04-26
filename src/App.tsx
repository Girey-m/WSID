import { Container } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { autorun } from "mobx";
import {
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useHandleDragEnd } from "./hooks/useHandleDragEnd";

import { openDB } from "./services/IndexDBUtils";
import { FunctionBox } from "./components/FunctionBox/FunctionBox";

import { SortableBox } from "./components/SortableBox/SortableBox";
import { DragAndDropLayout } from "./components/DragAndDropLayout/DragAndDropLayout";

import { itemsStore } from "./stores/itemStore";
import { BoxData } from "./types/BoxDataType";
import { initialBoxes } from "./constants/initialBoxes";

export const App = observer(function App() {
  const handleDragEnd = useHandleDragEnd();

  const [boards, setBoards] = useState<BoxData[]>([]);

  function getBoardFromInitialOrItem(item: BoxData): BoxData {
    const fromInitial = initialBoxes.find((box) => box.id === item.id);
    return item || fromInitial;
  }

  useEffect(() => {
    const dispose = autorun(() => {
      const savedBoards = itemsStore.items.map(getBoardFromInitialOrItem);
      setBoards(savedBoards);
      localStorage.setItem("items", JSON.stringify(itemsStore.items));
    });
    return () => dispose();
  }, []);

  openDB();
  return (
    <Container sx={{ display: "flex" }}>
      <FunctionBox />

      <Container
        sx={{
          display: "flex",
          maxWidth: "1440px",
          overflowX: "auto",
          overflowY: "hidden",
          justifyContent: "flex-start",
          gap: 2,
          padding: 4,
        }}
      >
        <DragAndDropLayout onDragEnd={handleDragEnd}>
          <SortableContext
            items={itemsStore.items}
            strategy={verticalListSortingStrategy}
          >
            {itemsStore.items.map((item: BoxData) => {
              const box = boards.find((b) => b.id === item.id);
              if (!box) return null;
              return (
                <SortableBox
                  key={item.id}
                  id={item.id}
                  title={box.title}
                  color={box.color}
                />
              );
            })}
          </SortableContext>
        </DragAndDropLayout>
      </Container>
    </Container>
  );
});
