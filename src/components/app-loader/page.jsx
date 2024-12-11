import React from "react";

const Loader = () => {
  return (
    <div
      id="uniqueLoader"
      className="flex justify-center items-center fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-full backdrop-filter backdrop-blur-sm bg-opacity-30 z-50"
    >
      <div className="preloaderBg" id="preloader">
        <div className="preloader"></div>
        <div className="preloader2"></div>
      </div>
    </div>
  );
};

export default Loader;
