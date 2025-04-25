import { Button, Box } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

import { CreateTaskBtnProps } from "../../interface/CreateTaskBtnProps";

export function CreateTaskBtn({ openModal }: Readonly<CreateTaskBtnProps>) {
  return (
    <Box>
      <Button
        type="button"
        onClick={openModal}
        variant="contained"
        color="primary"
        startIcon={<AddBoxIcon sx={{ fontSize: 60, transform: `scale(2)` }} />}
        sx={{
          height: "50px",
          fontSize: "16px",
          width: "100%",
          "&:hover": {
            backgroundColor: "#ff3d00",
          },
        }}
        aria-label="Создать задачу"
      >
        Создать задачу
      </Button>
    </Box>
  );
}
