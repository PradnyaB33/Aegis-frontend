import moment from "moment";
import { useState } from "react";

const useCustomCal = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const days = Array.from(
    { length: moment().daysInMonth() },
    (_, index) => index + 1
  );
  const emptyCellsBefore = Array.from(
    { length: moment().startOf("month").day },
    (_, index) => index
  );
  // Function to handle mouse down event
  const handleMouseDown = (day) => {
    setStartDate(day);
    setEndDate(day);
  };

  // Function to handle mouse enter event
  const handleMouseEnter = (day) => {
    if (startDate !== null) {
      setEndDate(day);
    }
  };
  // Function to handle mouse up event
  const handleMouseUp = () => {
    if (startDate !== null && endDate !== null) {
      console.log("Selected Range:", startDate, "to", endDate);
      // You can perform any action here with the selected range
      // For now, we are just logging it to the console
    }
    setStartDate(null);
    setEndDate(null);
  };
  return {
    days,
    emptyCellsBefore,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    startDate,
    endDate,
  };
};

export default useCustomCal;
