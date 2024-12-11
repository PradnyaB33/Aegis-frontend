import React from "react";

const ModalHeading = ({ heading, info, className = "" }) => {
    return (
        <div style={{ padding: "2% 0" }} className={className}>
            <h1 className="text-[1.5rem] leading-none text-gray-700   font-semibold  tracking-tight !text-xl">
                {heading}
            </h1>
            <p className="text-gray-500  tracking-tight ">{info}</p>
        </div>
    );
};

export default ModalHeading;
