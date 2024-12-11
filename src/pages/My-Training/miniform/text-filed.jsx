import { CircularProgress } from "@mui/material";
import React from "react";

const TextFiledColumn = ({
  setOpen,
  length,
  text,
  className,
  Icon,
  isLoading,
}) => {
  return (
    <div
      className={`px-6 py-5 text-white rounded-lg shadow-inner ${className} flex justify-between gap-4 cursor-pointer  transition-all duration-300`}
      onClick={() => {
        setOpen(true);
      }}
    >
      {!isLoading ? (
        <Icon className="w-6 h-6" />
      ) : (
        <CircularProgress size={"small"} color="inherit" />
      )}
      <h4 className="font-medium text-lg w-max">
        {text} : {length}
      </h4>
    </div>
  );
};

export default TextFiledColumn;
