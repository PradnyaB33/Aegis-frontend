import React from "react";
import useDepartmentNotification from "../../../hooks/QueryHook/notification/department-notification/hook";
import DepartmentCards from "./department-card";

const InputForm = () => {
  const { getDeptNotificationToEmp } = useDepartmentNotification();

  return (
    <div className="flex w-full flex-col gap-4">
      {getDeptNotificationToEmp && getDeptNotificationToEmp.length > 0 ? (
        getDeptNotificationToEmp.map((item, index) => (
          <DepartmentCards key={index} items={item} />
        ))
      ) : (
        <h1>Sorry, no request found</h1>
      )}
    </div>
  );
};

export default InputForm;
