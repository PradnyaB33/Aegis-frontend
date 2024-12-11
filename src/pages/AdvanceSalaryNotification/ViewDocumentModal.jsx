import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

const ViewDocumentModal = ({ handleClose, open, document }) => {
  let documentUrl = document?.file;
  console.log(documentUrl);

  const isImage =
    documentUrl &&
    (documentUrl.endsWith(".jpg") ||
      documentUrl.endsWith(".jpeg") ||
      documentUrl.endsWith(".png"));

  return (
    <>
      <Dialog
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "700px!important",
            height: "80%",
            maxHeight: "85vh!important",
          },
        }}
        open={open}
        onClose={handleClose}
        className="w-full"
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex w-full justify-between py-4 items-center px-4">
          <h1 className="text-xl pl-2 font-semibold font-sans">
            View Document
          </h1>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <DialogContent className="border-none !pt-0 !px-0 shadow-md outline-none rounded-md">
          {documentUrl ? (
            isImage ? (
              <div className="flex justify-center items-center h-full">
                <img
                  src={documentUrl}
                  alt="User Document"
                  style={{ maxHeight: "80vh", maxWidth: "100%" }}
                />
              </div>
            ) : (
              <object
                type="application/pdf"
                width="100%"
                height="400px"
                data={documentUrl}
                aria-label="User Document"
                className="w-full"
              />
            )
          ) : (
            <p className="text-center mt-4">Document is not uploaded.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewDocumentModal;
