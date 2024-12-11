import FolderIcon from "@mui/icons-material/Folder";
import PeopleIcon from "@mui/icons-material/People";
import React from "react";

const Options = ({ setOption }) => {
  return (
    <div className="w-full flex gap-4">
      <div
        onClick={() => setOption("emp")}
        className="w-[150px] cursor-pointer p-5 h-[150px] shadow-md flex flex-col items-center justify-center"
      >
        <PeopleIcon
          style={{
            width: "100%",
            height: "auto",
            borderBottom: "2px solid #e5e7eb",
            color: "green",
          }}
        />
        <div>Employee List</div>
      </div>
      <div
        onClick={() => setOption("doc")}
        className="w-[150px] cursor-pointer p-5 h-[150px] shadow-md flex flex-col items-center justify-center"
      >
        <FolderIcon
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

export default Options;
