
import { West } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../hooks/UserData/useUser";

// Function to capitalize>>first letter of a string
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const TempHeader = ({ heading, oneLineInfo }) => {
  const navigate = useNavigate();
  
  const user = UserProfile().getCurrentUser();


  const firstName = capitalizeFirstLetter(user?.first_name);
  const lastName = capitalizeFirstLetter(user?.last_name);

  return (
    <header className="flex flex-col md:flex-row items-center  gap-2 justify-between p-3 bg-gray-50 shadow-md ">
      <div className="flex-shrink-0 mt-1 mb-2 md:mb-0 ">
        <IconButton onClick={() => navigate(-1)}>
          <West />
        </IconButton>
      </div>
      <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-lg md:text-xl font-semibold">{heading}</h1>
        {oneLineInfo && (
          // <p className="text-xs md:text-sm text-gray-600 w-full text-center md:text-left">
          // temp
          <p className="text-xs md:text-sm text-gray-600 w-full  !text-left">
            {oneLineInfo}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 mt-2 md:mt-0">
        <p className="text-sm md:text-lg font-semibold text-gray-700 pr-3">
          Welcome, {firstName} {lastName}
        </p>
      </div>
    </header>
  );
};

export default TempHeader;
