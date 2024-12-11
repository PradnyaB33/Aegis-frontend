import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";

const CountdownTimer = () => {
  const [targetDate, setTargetDate] = useState(0);

  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getFromLocalStorage = (key) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };

  useEffect(() => {
    // Check if there is stored data in localStorage
    const storedTargetDate = getFromLocalStorage("countdownTimerTargetDate");

    if (storedTargetDate) {
      setTargetDate(storedTargetDate);
    } else {
      // Set the target date to 5 minutes from now
      const now = new Date();
      const newTargetDate = now.getTime() + 5 * 60 * 1000; // 5 minutes in milliseconds
      setTargetDate(newTargetDate);
      saveToLocalStorage("countdownTimerTargetDate", newTargetDate);
    }
  }, [targetDate]);

  const handleComplete = () => {
    console.log("Countdown completed!");
  };

  return (
    <div>
      <Countdown
        date={targetDate}
        onComplete={handleComplete}
        renderer={({ minutes, seconds, completed }) => (
          <span>
            {minutes}:{seconds}
          </span>
        )}
      />
    </div>
  );
};

export default CountdownTimer;
