import { EmojiEmotionsOutlined } from "@mui/icons-material";
import React from "react";

//loader for upload photo
const Loader = ({ isLoading = false, outerClassName = "" }) => {
  return (
    isLoading && (
      <div
        className={`absolute top-0 left-0 w-full h-full flex justify-center items-center flex-col gap-4 backdrop-filter backdrop-blur-sm bg-black bg-opacity-30 z-50 ${outerClassName}`}
      >
        {" "}
        <div className="rounded-full border-t-[3px] border-b-[3px] border-[3px] border-[#1976d2] border-t-[#d5312f] border-b-[#d5312f] animate-spin w-14 h-14 inset-0 flex items-center justify-center p">
          <EmojiEmotionsOutlined className="animate-pulse text-white !text-4xl" />
        </div>
        <p className="text-white animate-pulse ring-offset-2 underline-offset-4 underline">
          Recognizing face and authenticating
        </p>
      </div>
    )
  );
};

export default Loader;
