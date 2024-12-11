import { weekdays } from "moment";
import React from "react";
import useCustomCal from "./useCustomCal";

const CustomCalendar = () => {
  const {
    days,
    emptyCellsBefore,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    startDate,
    endDate,
  } = useCustomCal();

  return (
    <div className="grid grid-cols-7 gap-1 mt-48">
      {weekdays().map((day) => (
        <div key={day} className="day-header text-center">
          {day}
        </div>
      ))}
      {emptyCellsBefore.map((_, index) => (
        <div key={`empty-${index}`} className="empty-cell"></div>
      ))}
      {days.map((day, index) => (
        <div
          key={index}
          className={`select-none day-cell text-center ${
            day >= startDate && day <= endDate ? "bg-blue-500 text-white" : ""
          }`}
          onMouseDown={() => handleMouseDown(day)}
          onMouseEnter={() => handleMouseEnter(day)}
          onMouseUp={handleMouseUp}
          onTouchStart={() => handleMouseDown(day)}
          onTouchMove={() => handleMouseEnter(day)}
          onTouchEnd={handleMouseUp}
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export default CustomCalendar;
