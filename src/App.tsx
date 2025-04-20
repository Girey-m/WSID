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

  useEffect(() => {
    const disposer = autorun(() => {
      const savedBoards = itemsStore.items.map((id) => {
        const fromInitial = initialBoxes.find((box) => box.id === id);
        return (
          fromInitial || {
            id,
            title: id,
            color: "#1976d2",
          }
        );
      });

      setBoards(savedBoards);
    });

    return () => disposer(); // не забудь очистить
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
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        background: "aqua",
        gap: 2,
        padding: 4,
      }}
    >
      <AddBoardModalWindowBtn openModal={() => setIsModalOpen(true)} />
      <AddBoardModalWindow
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBoard}
      />
      <DragAndDropLayout onDragEnd={handleDragEnd}>
        <SortableContext
          items={itemsStore.items}
          strategy={verticalListSortingStrategy}
        >
          {itemsStore.items.map((id: string) => {
            const box = boards.find((b) => b.id === id);
            if (!box) return null;
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
