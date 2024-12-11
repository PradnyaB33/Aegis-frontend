import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal } from "@mui/material";
import React from "react";

// CustomModal Component
const FullskapeResuable = ({
  open,
  onClose,
  children,
  heading,
  subHeading,
  className = "",
  modalWidth = "md", // Default width is "md"
}) => {
  // Define sizes based on modalWidth prop
  const modalSize = {
    sm: "w-[95%]",
    md: "w-[550px]",
    lg: "w-[800px]",
    table: "w-[calc(80%+0px)]",  // Width matching the table layout
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      keepMounted={false}
    >
      <Box
        className={`border-none gap-2 shadow-md outline-none h-auto max-h-[600px] overflow-auto rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white flex flex-col ${className} ${modalSize[modalWidth] || modalSize.md}`}
      >
        {heading && (
          <div className="pb-2 p-4 border-b-2 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold font-sans">{heading}</h1>
              {subHeading && (
                <p className="text-xs text-gray-500">{subHeading}</p>
              )}
            </div>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </div>
        )}
        <div className="px-4 pb-2">{children}</div>
      </Box>
    </Modal>
  );
};

export default FullskapeResuable;
