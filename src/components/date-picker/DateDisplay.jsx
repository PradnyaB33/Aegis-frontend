import React from "react";

const DateDisplay = () => {
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const dateString = today.toLocaleDateString("en-US", options);

  return (
    <div>
      <div className=" flex items-center space-x-4 max-w-md mx-auto">
        <div>
          <p className="text-xl font-bold text-gray-600">{dateString}</p>
          {/* <p className="text-sm text-gray-500">Today's Date</p> */}
        </div>
      </div>
    </div>
  );
};

export default DateDisplay;
