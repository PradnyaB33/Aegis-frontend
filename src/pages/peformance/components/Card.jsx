import React from "react";

const Card = ({ title, data }) => {
  return (
    <>
      <div className="min-w-[200px] bg-white border rounded-md">
        <div className=" px-4 py-3   rounded-lg leading-none flex items-top justify-start space-x-6">
          <div className="space-y-1">
            <h1 className="font-semibold  text-[#67748E] ">{title}</h1>
            <p className="text-lg  tracking-tight ">{data}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
