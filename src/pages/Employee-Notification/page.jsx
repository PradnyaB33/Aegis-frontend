import React from "react";
import Card from "./components/card";

const EmployeeNotification = () => {
  const dummyData = [
    {
      name: "Leave Notification",
      count: 0,
      color: "#FF7373",
      url: "/self/leave-notification",
    },
    {
      name: "Shift Notification",
      count: 0,
      color: "#3668ff",
      url: "/self/shift-notification",
    },
  ];

  return (
    <div className="pt-5">
      <div className="w-full h-full gap-2 flex p-4 md:flex-wrap md:flex-row flex-col justify-center">
        <Card card={dummyData} />
      </div>
    </div>
  );
};

export default EmployeeNotification;
