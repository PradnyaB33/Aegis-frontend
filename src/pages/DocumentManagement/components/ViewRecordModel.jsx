import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton, Modal, Typography, Box } from "@mui/material";
import React from "react";

const ViewRecordModel = ({ file, open, onClose }) => {
  console.log("file", file);

  // Function to open the PDF in a new tab
  const openPDFInNewTab = () => {
    if (file && file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file.fileName);
      window.open(fileURL, "_blank");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        className="bg-white p-[30px] md:w-[40%] md:h-[40%] w-[300px] h-[200px] rounded-lg relative"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          padding: "30px",
          bgcolor: "white",
          width: "300px",
          height: "200px",
          borderRadius: "8px",
        }}
      >
        {file ? (
          <>
            {/* Close Button */}
            <IconButton
              aria-label="close"
              onClick={onClose}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "red",
              }}
            >
              <CloseIcon style={{ color: "white" }} />
            </IconButton>

            {/* Display File Name */}
            <Typography variant="h6" gutterBottom>
              {file.fileName}
            </Typography>

            {/* PDF Open Button */}
            {file.type === "application/pdf" ? (
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={openPDFInNewTab}
              >
                Open PDF
              </Button>
            ) : (
              <Typography color="error">
                Unsupported file format. Please upload a PDF.
              </Typography>
            )}
          </>
        ) : (
          <Typography color="error">
            No file selected. Please try again.
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ViewRecordModel;
