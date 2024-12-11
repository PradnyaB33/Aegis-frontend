import { Info } from "@mui/icons-material";
import React from "react";

const EmptyAlertBox = ({ title, desc }) => {
  return (
    <section className="bg-white  border p-4 rounded-md w-full">
      <article className="flex items-center text-red-500 gap-2">
        <Info className="!text-3xl mt-1" />
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-gray-900">{desc}</p>
        </div>
      </article>
    </section>
  );
};

export default EmptyAlertBox;
