import { Container } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { autorun } from "mobx";
import { AddBoardModalWindowBtn } from "./components/AddBoardModalWindowBtn/AddBoardModalWindowBtn";
import { AddBoardModalWindow } from "./components/AddBoardModalWindow/AddBoardModalWindow";
import { AddBoard } from "./components/AddBoard/AddBoard";

import { itemsStore } from "./stores/itemStore";
import { BoxData } from "./types/BoxDataType";
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [boards, setBoards] = useState<BoxData[]>([]);

  function getBoardFromInitialOrItem(item: BoxData): BoxData {
    const fromInitial = initialBoxes.find((box) => box.id === item.id);
    return item || fromInitial;
  }

  useEffect(() => {
    const disposer = autorun(() => {
      const savedBoards = itemsStore.items.map(getBoardFromInitialOrItem);
      setBoards(savedBoards);
    });
    return () => disposer();
  }, []);

  const handleSaveBoard = (newBoard: BoxData) => {
    AddBoard(newBoard, setBoards);
  };

  useEffect(() => {
    const dispose = autorun(() => {
      localStorage.setItem("items", JSON.stringify(itemsStore.items));
    });
    return () => dispose();
  }, []);

  return (
    <Container>
      <AddBoardModalWindowBtn openModal={() => setIsModalOpen(true)} />
      <AddBoardModalWindow
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBoard}
      />
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
