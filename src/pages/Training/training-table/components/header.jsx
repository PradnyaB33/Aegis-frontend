import React from "react";

const TableHeader = () => {
  return (
    <div className="flex border-b bg-gray-200 font-medium dark:border-neutral-500 ">
      <div className="!font-medium shadow-lg ">
        <div className="px-6 py-3 text-center">Training Image</div>
        <div className="px-6 py-3 text-center">Training Name</div>
        <div className="px-6 py-3 text-center">Training Duration</div>
        <div className="px-6 py-3 text-center">Actions</div>
      </div>
    </div>
  );
};

export default TableHeader;
