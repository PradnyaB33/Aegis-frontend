import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton, Modal } from "@mui/material";
import React from "react";

const DocPreviewModal = ({ fileData, setOpenState, openState }) => {
  const closeModal = () => {
    setOpenState(false);
  };

  const openPDFInNewTab = () => {
    const fileURL = URL.createObjectURL(fileData);
    window.open(fileURL, "_blank");
  };

  return (
    <Modal
      open={openState}
      onClose={closeModal}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="bg-white p-[30px] md:w-[40%] md:h-[40%] w-[300px] h-[200px] rounded-lg relative"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {fileData && (
          <>
            <IconButton
              aria-label="close"
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                backgroundColor: "red",
              }}
            >
              <CloseIcon style={{ color: "white" }} />
            </IconButton>
            <div
              className="w-full h-full flex justify-center items-center"
              style={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {fileData ? (
                <Button
                  size="large"
                  variant="contained"
                  onClick={openPDFInNewTab}
                >
                  Open PDF
                </Button>
              ) : (
                <p>Unsupported file format. Please upload a PDF.</p>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DocPreviewModal;
