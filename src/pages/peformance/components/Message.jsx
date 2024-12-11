import { InfoOutlined } from "@mui/icons-material";
import moment from "moment";
import React, { useState } from "react";
import { useQuery } from "react-query";
import usePerformanceApi from "../../../hooks/Performance/usePerformanceApi";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";

const Message = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const [message, setMessage] = useState("Welcome to Perfromance Settings");
  const { fetchPerformanceSetup } = usePerformanceApi();
  useQuery(
    ["performancePeriod"],
    () => fetchPerformanceSetup({ user, authToken }),
    {
      onSuccess: (data) => {
        const endDate = moment(data.enddate); // replace with your actual endDate field
        const currentDate = moment();

        console.log("enddate", endDate.diff(currentDate, "days"));
        if (data?.stages === "Send form to employee") {
          if (endDate.diff(currentDate, "days") <= 2) {
            setMessage(
              "The submission period for employee forms is soon closing."
            );
          }
          if (endDate.diff(currentDate, "days") < 0) {
            setMessage("Time for sending for has been ended.");
          } else {
            setMessage(
              "The process to send the form to the employee has now started."
            );
          }
        }

        if (data?.stages === "Goal setting") {
          if (endDate.diff(currentDate, "days") <= 2) {
            setMessage(
              "The submission period for goal setting is soon closing."
            );
          }
          if (endDate.diff(currentDate, "days") < 0) {
            setMessage("Time for setting up goal has been ended.");
          } else {
            setMessage("The process to set up goal has now started.");
          }
        }

        if (
          data?.stages === "KRA stage/Ratings Feedback/Manager review stage"
        ) {
          if (endDate.diff(currentDate, "days") <= 2) {
            setMessage(
              "The submission period for KRA stage/Ratings Feedback/Manager review is soon closing."
            );
          }
          if (endDate.diff(currentDate, "days") < 0) {
            setMessage(
              "Time for KRA stage/Ratings Feedback/Manager review has been ended."
            );
          } else {
            setMessage(
              "The process to KRA stage/Ratings Feedback/Manager review has now started."
            );
          }
        }
        if (data?.stages === "Monitoring stage/Feedback collection stage") {
          if (endDate.diff(currentDate, "days") < 0) {
            setMessage(
              "The submission period for KRA stage/Ratings Feedback/Manager review is soon closing."
            );
          }
          if (endDate.diff(currentDate, "days") < 0) {
            setMessage(
              "Time for KRA stage/Ratings Feedback/Manager review has been ended."
            );
          } else {
            setMessage(
              "The process to KRA stage/Ratings Feedback/Manager review has now started."
            );
          }
        }
        if (data?.stages === "Employee acceptance/acknowledgement stage") {
          if (endDate.diff(currentDate, "days") <= 2) {
            setMessage(
              "The submission period for employee acceptance/acknowledgement is soon closing."
            );
          }
          if (endDate.diff(currentDate, "days") < 0) {
            setMessage(
              "Time for employee acceptance/acknowledgement has been ended."
            );
          } else {
            setMessage(
              "The process to accept/acknowledge goal has now started."
            );
          }
        }
      },
    }
  );
  return (
    <div className="py-4 w-full h-max">
      <div className="bg-blue-100 p-2 overflow-hidden rounded-md">
        <h1 className="text-lg scrolling-text text-red-600   gap-2 flex items-center">
          <InfoOutlined /> Important Notice :- {message}
        </h1>
      </div>
    </div>
  );
};

export default Message;
