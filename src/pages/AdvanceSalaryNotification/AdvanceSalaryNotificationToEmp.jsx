import React from "react";
import InputForm from "./Component/input-form";

const AdvanceSalaryNotificationToEmp = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="w-full pt-5 text-xl font-bold px-14 py-3 shadow-md bg-white border-b border-gray-300">
        Advance Salary Notifications
        <p className="text-sm font-extralight">
          Here employee's would be able to check the status of their advance salary 
          requests
        </p>
      </h1>
      <div className="w-full flex justify-between px-14">
        <InputForm/>
      </div>
    </div>
  );
};

export default AdvanceSalaryNotificationToEmp;
