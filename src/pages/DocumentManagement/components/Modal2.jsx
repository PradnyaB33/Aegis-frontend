// DocPreviewModal.js
import CloseIcon from "@mui/icons-material/Close";
import { Button, Modal } from "@mui/material";
import React from "react";

const DocPreviewModal2 = ({ fileData, setOpenState, openState }) => {
  const closeModal = () => {
    setOpenState(false);
  };

  return (
    <Modal
      open={openState}
      onClose={closeModal}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        width: "70vw",
        height: "100vh",
      }}
    >
      <div className="bg-white p-[30px] w-[80%] h-[80%] rounded-lg relative flex justify-center flex-col">
        {fileData && (
          <>
            <div
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={closeModal}
                startIcon={<CloseIcon />}
              >
                Close
              </Button>
            </div>
            <div style={{ flex: 1 }}>
              <iframe
                title="Document Preview"
                src={fileData}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DocPreviewModal2;
