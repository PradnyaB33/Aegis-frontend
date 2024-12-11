import { Box, Modal } from "@mui/material";
import React from "react";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import MiniForm from "./components/mini-form";

const SelfieForm = () => {
  const { open, setOpen, media } = useSelfieStore();

  return (
    <Modal
      open={open}
      onClose={async () => {
        setOpen(false);
        const tracks = await media.getTracks();
        tracks.forEach(async (track) => {
          await track?.stop(); // Stop each track in the media stream
        });
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="border-none !z-10 shadow-md outline-none rounded-md gap-2 flex flex-col absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-white p-4 overflow-auto w-fit items-center h-min">
        <MiniForm />
      </Box>
    </Modal>
  );
};

export default SelfieForm;
