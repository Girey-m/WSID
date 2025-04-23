import { useState } from "react";

import { itemsStore } from "../../stores/itemStore";
import { EditBoardModalWindow } from "../EditBoardModalWindow/EditBoardModalWindow";
import { EditBoard } from "../EditBoard/EditBoard";
import { BoxData } from "../../types/BoxDataType";

import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export function ActionMenuBtn({ id }: Readonly<{ id: string }>) {
  const [archorEl, setArchorEl] = useState<null | HTMLElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const open = Boolean(archorEl);

  const openClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setArchorEl(event.currentTarget);
  };

  const closeClick = () => {
    setArchorEl(null);
  };

  const deleteClick = () => {
    itemsStore.deleteItem(id);
    closeClick();
  };

  const editClick = () => {
    setEditOpen(true);
    closeClick();
  };

  const handleSaveBoard = (newBoard: BoxData) => {
    EditBoard(newBoard);
  };

  return (
    <Box>
      <IconButton
        onClick={openClick}
        aria-label="more"
        aria-haspopup="true"
        aria-controls="long-menu"
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "0",
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={archorEl}
        open={open}
        onClose={closeClick}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={editClick}>Редактировать</MenuItem>
        <MenuItem onClick={deleteClick}>Удалить</MenuItem>
      </Menu>
      <EditBoardModalWindow
        isVisible={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveBoard}
        id={id}
      />
    </Box>
  );
}
