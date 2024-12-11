import { default as React } from "react";
import TDSTable0 from "./Table/myDeclarations/TDSTable0";

const Tab0 = () => {
  return (
    <div className="overflow-auto !p-0 ">
      <div className="flex items-center justify-between ">
        <div className="w-full p-4  ">
          <h1 className="text-2xl ">My Declarations</h1>
          <p>Below are the declarations done by you</p>
        </div>
      </div>

      <TDSTable0 />
    </div>
  );
};

export default Tab0;
