import { West } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderBackComponent = ({ heading, oneLineInfo }) => {
  const navigate = useNavigate();

  return (
    <header className="text-xl p-2 bg-gray-50 shadow-md flex gap-2 md:p-4">
      <IconButton onClick={() => navigate(-1)}>
        <West className="" />
      </IconButton>
      <div className="flex items-baseline justify-center flex-col">
        {heading}
        {oneLineInfo && (
          <p className="text-xs text-gray-600 truncate w-full min-w-[250px]">
            {oneLineInfo}
          </p>
        )}
      </div>
    </header>
  );
};

export default HeaderBackComponent;
