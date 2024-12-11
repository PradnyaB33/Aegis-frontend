import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

const ProofModel = ({ pdf, handleClosePDF }) => {
  const handleDownload = (pdf) => {
    // You can use any method to trigger the download, such as creating an invisible link and clicking it
    const link = document.createElement("a");
    link.href = pdf;
    link.download = "File1.pdf";
    link.click();
  };

  return (
    <Dialog open={pdf !== null} onClose={handleClosePDF}>
      <DialogTitle>Document</DialogTitle>
      <DialogContent>
        <div className="scrollt ">
          <object
            type="application/pdf"
            data={`${pdf}`}
            alt="none"
            aria-label="pdfSalary"
            className="min-h-[60vh] !w-[400px] "
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => handleDownload(pdf)}>
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProofModel;
