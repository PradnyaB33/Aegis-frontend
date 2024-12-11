import { Upload } from "@mui/icons-material";
import { Fab } from "@mui/material";
import React, { useRef, useState } from "react";

const PdfInput = ({ field, caching = false, className }) => {
  const displayPdf = async (file) => {
    // Implement the logic to display the PDF
  };

  if (field.value) {
    displayPdf(field.value);
  }

  const [selectedPdf, setSelectedPdf] = useState(field?.value);
  const hiddenInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedPdf(file);

    displayPdf(file);
  };

  return (
    <object
      className={`flex border-gray-200 border-[.5px] bg-[#f8f8ff59]  items-center h-48 rounded-lg w-full justify-center !hover:bg-[ghostwhite] cursor-pointer transition-all !bg-cover ${className} relative`}
      data={selectedPdf ? URL.createObjectURL(selectedPdf) : ""}
      onClick={() => {
        hiddenInputRef.current.click();
      }}
    >
      {selectedPdf && (
        <embed
          src={URL.createObjectURL(selectedPdf)}
          type="application/pdf"
          className="w-full h-full rounded-lg overflow-hidden"
        />
      )}
      <Fab
        className="!absolute !top-1/2 !left-1/2 !right-1/2 !p-2"
        variant="extended"
      >
        <Upload className="" />
      </Fab>

      <input
        type="file"
        accept="application/pdf"
        id="pdf_url"
        placeholder="placeholder"
        onChange={(e) => {
          field.onChange(e.target.files[0]);
          handleFileChange(e);
        }}
        className="hidden"
        ref={hiddenInputRef}
      />
    </object>
  );
};

export default PdfInput;
