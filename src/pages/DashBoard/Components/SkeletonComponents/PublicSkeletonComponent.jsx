import { BeachAccessOutlined } from "@mui/icons-material";
import { Avatar, Divider, Skeleton } from "@mui/material";
import React from "react";

const PublicSkeletonComponent = () => {
  return (
    <div className="rounded-md bg-white  w-full shadow-sm">
      <div className="flex w-full px-4 items-center justify-between">
        <div className="flex items-center gap-2 py-2  ">
          <Avatar
            variant="rounded"
            className="!bg-sky-400 p-1 h-[30px] rounded-full"
          >
            <BeachAccessOutlined />
          </Avatar>
          <h1 className="text-lg  font-bold text-[#67748E]">
            Upcoming Public Holiday
          </h1>
        </div>
        {/* <button className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500">
            View All
          </button> */}
      </div>
      <Divider variant="fullWidth" orientation="horizontal" />
      {Array.from({ length: 3 }).map((e, id) => (
        <div key={id}>
          <div className="p-4">
            <Skeleton animation="wave" height={20} width={150} />
            <Skeleton animation="wave" height={25} width={100} />
          </div>
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>
      ))}
    </div>
  );
};

export default PublicSkeletonComponent;
