import { PeopleOutline } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React from "react";

const EmpCard = () => {
  return (
    <div className="hover:scale-105  cursor-pointer transition-all w-[20%] py-4 bg-white rounded-md shadow-md p-3">
      <div className="space-y-2">
        <Avatar
          className="!text-gray-700 !mb-3 shadow-sm !bg-gray-100 h-[100px] text-4xl p-1 "
          variant="rounded"
          sizes="small"
          sx={{ width: "30", height: "30" }}
        >
          <PeopleOutline />
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-bold text-2xl">₹22000</h1>
          <h1 className="text-sm ">Last Month Salary</h1>
        </div>
      </div>
    </div>
  );
};

export default EmpCard;
