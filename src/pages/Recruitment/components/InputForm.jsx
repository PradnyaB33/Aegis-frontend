import React from "react";
import useJobPositionNotification from "../../../hooks/QueryHook/notification/job-position-notification/useJobPositionNotification";
import JobPositionCard from "./JobPositionCard";

const InputForm = () => {
  const { getNotificationToEmp } = useJobPositionNotification();
  console.log(getNotificationToEmp);
  return (
    <div className="flex w-full flex-col gap-4">
      {getNotificationToEmp && getNotificationToEmp.length > 0 ? (
        getNotificationToEmp.map((item, index) => (
          <JobPositionCard key={index} items={item} />
        ))
      ) : (
        <h1>Sorry, no request found</h1>
      )}
    </div>
  );
};

export default InputForm;
