import React from "react";
import useTDS from "../../../../hooks/IncomeTax/useTDS";
import TDSTab5 from "./TDSTab5";

const Tab4 = () => {
  const { declared, pending, accepted, rejected } = useTDS();
  return (
    <div className="overflow-auto !p-0 ">
      <div className="flex items-center justify-between ">
        <div className="w-full p-4  ">
          <h1 className="text-2xl ">Less : Deduction under chapter VI A</h1>
          <p>
            Below are the declarations done so far by you for any modifications
            click on action
          </p>
        </div>
      </div>

      <div className="flex items-center flex-wrap bg-white border-[.5px] border-gray-200 gap-10 p-4">
        <div>
          <h1 className="text-gray-600">Amount Declared</h1>
          <p className="text-xl">INR {declared}</p>
        </div>

        <div>
          <h1 className="text-gray-600">Pending Approval Amount</h1>
          <p className="text-xl">INR {pending}</p>
        </div>
        <div>
          <h1 className="text-gray-600">Amount Accepted</h1>
          <p className="text-xl">INR {accepted}</p>
        </div>
        <div>
          <h1 className="text-gray-600">Amount Rejected</h1>
          <p className="text-xl">INR {rejected}</p>
        </div>
      </div>

      <TDSTab5 />
      {/* <TDSTable4 /> */}
    </div>
  );
};

export default Tab4;
