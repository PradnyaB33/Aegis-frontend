import React from "react";
import { useNavigate } from "react-router-dom";

const UnAuthorized = () => {
  const navigate = useNavigate("");
  return (
    <div className="h-[90vh] flex items-center justify-center">
      <img className="h-[300px]" src="/unauthorized.svg" alt="unauthorized" />
      <div>
        <div className="space-y-2 mb-4">
          <h1 className="text-4xl font-semibold pr-10">UnAuthorized </h1>
          <p className="text-lg font-medium">You cant access this resources</p>
        </div>
        <button
          className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default UnAuthorized;
