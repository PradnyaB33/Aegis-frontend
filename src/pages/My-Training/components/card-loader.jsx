import { CircularProgress } from "@mui/material";
import React from "react";

const CardLoader = () => {
  return (
    <div className="bg-white border rounded-lg p-8 dark:border-neutral-500 flex w-full justify-between shadow-1-strong">
      <div className="flex gap-8">
        <div className="w-48 h-36 bg-gray-200 animate-pulse rounded-md" />
        <div className="text-left">
          <div className="font-bold text-xl bg-gray-200 animate-pulse h-8 w-40 mb-2" />
          <div className="bg-gray-200 animate-pulse h-4 w-48 mb-2" />
          <div className="bg-gray-200 animate-pulse h-4 w-24 mb-2" />
          <div className="bg-gray-200 animate-pulse h-4 w-32 mb-2" />
          <div className="bg-gray-200 animate-pulse h-4 w-40 mb-2" />
          <div className="bg-gray-200 animate-pulse h-4 w-56 mb-2" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <CircularProgress size={24} />
        <CircularProgress size={24} />
      </div>
    </div>
  );
};

export default CardLoader;
