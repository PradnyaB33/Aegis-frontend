import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, Divider, IconButton } from "@mui/material";
import React from "react";

const EmpEditModal = ({ handleClose, open }) => {
  return (
    <>
      <Dialog
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "800px!important",
            height: "100%",
            maxHeight: "85vh!important",
          },
        }}
        open={open}
        onClose={handleClose}
        className="w-full"
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex w-full justify-between py-4 items-center  px-4">
          <h1 id="modal-modal-title" className="text-lg pl-2 font-semibold">
            Edit Employee Setting
          </h1>
          <IconButton onClick={handleClose}>
            <Close className="!text-[16px]" />
          </IconButton>
        </div>

        <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
          <div className="w-full">
            <Divider variant="fullWidth" orientation="horizontal" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmpEditModal;
