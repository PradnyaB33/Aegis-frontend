import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate("");
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center">
      {/* <h1 className="text-4xl font-semibold pr-10">404 Not Found </h1> */}
      <img className="h-[200px]" src="/notfound.svg" alt="unauthorized" />
      <div className="space-y-2 my-4">
        <p className="text-xl font-semibold">page not found</p>
      </div>
      <button
        className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
