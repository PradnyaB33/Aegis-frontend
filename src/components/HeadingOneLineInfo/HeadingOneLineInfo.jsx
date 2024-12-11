import React from "react";

const HeadingOneLineInfo = ({ heading, info, className = "" }) => {
  return (
    <div style={{ margin: "2% 0%" }} className={className}>
      <h1 className="text-[1.5rem] leading-none text-gray-700   font-semibold  tracking-tight">
        {heading}
      </h1>
      <p className="text-gray-500  tracking-tight ">{info}</p>
    </div>
  );
};

export default HeadingOneLineInfo;
