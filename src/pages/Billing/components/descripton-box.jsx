import React from "react";

const DescriptionBox = ({ Icon, descriptionText, mainText }) => {
  return (
    <div className="flex gap-3 pr-2 pt-3 items-center text-lg">
      <div className="text-Brand-neutrals/brand-neutrals-3 flex gap-1 items-center">
        <Icon className="!text-xl" />
        {descriptionText}
      </div>
      <div>{mainText}</div>
    </div>
  );
};

export default DescriptionBox;
