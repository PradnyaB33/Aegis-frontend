import FolderIcon from "@mui/icons-material/Folder";
import React from "react";

const ShowDoc = ({ data, setOpen }) => {
  return (
    <div className="w-full p-8">
      <div className="w-[150px] cursor-pointer p-5 h-[150px] shadow-md flex flex-col items-center justify-center">
        <FolderIcon
          onClick={() => setOpen("doc")}
          style={{
            width: "100%",
            height: "auto",
            borderBottom: "2px solid #e5e7eb",
            color: "#1976d2",
          }}
        />
        <div>Document List</div>
      </div>
    </div>
  );
};

export default ShowDoc;
