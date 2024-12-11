import Skeleton from "@mui/material/Skeleton";
import React from "react";

const SkeletonFilterSection = () => {
  return (
    <div className="mt-4 w-full bg-white shadow-md rounded-md">
      <div className="w-full border-b-[.5px] items-center justify-between flex gap-2 py-2 px-4 border-gray-300">
        <div className="flex items-center gap-2">
          <Skeleton
            variant="circular"
            width={24}
            height={24}
            className="text-[#67748E]"
          />
          <Skeleton variant="text" width={120} height={20} />
        </div>
        <div className="flex w-[80%] gap-6 items-center justify-end">
          <button className="!w-max flex justify-center h-[25px] gap-2 items-center rounded-md px-1 text-sm font-semibold text-[#152745] hover:bg-gray-50 focus-visible:outline-gray-100">
            <Skeleton variant="text" width={80} height={25} />
          </button>
          <Skeleton variant="rect" width={150} height={30} />
          <Skeleton variant="rect" width={150} height={30} />
          <Skeleton variant="rect" width={150} height={30} />
        </div>
      </div>
    </div>
  );
};

export default SkeletonFilterSection;
