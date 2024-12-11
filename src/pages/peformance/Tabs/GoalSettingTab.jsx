import { format } from "date-fns";
import moment from "moment";
import React, { useState } from "react";
import { useQuery } from "react-query";
import usePerformanceApi from "../../../hooks/Performance/usePerformanceApi";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import Card from "../components/Card";
import GoalsTable from "../components/GoalTable/GoalsTable";
import Message from "../components/Message";

const GoalSettingTab = () => {
  const authToken = useAuthToken();
  const [message, setMessage] = useState("Welcome to Goal Settings");
  console.log(`🚀 ~ message:`, message);
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();

  const { fetchPerformanceSetup } = usePerformanceApi();
  const {
    data: performance,
    error,
    isError,
  } = useQuery(
    ["performancePeriod"],
    () => fetchPerformanceSetup({ user, authToken }),
    {
      onSuccess: (data) => {
        const endDate = moment(data.enddate); // replace with your actual endDate field
        const currentDate = moment();

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
      onError: (error) => {
        console.log(error);
      },
    }
  );

  console.log("error state", error, isError);
  // const { data: performance } = useQuery(
  //   "performancePeriod",
  //   async () => {
  //     const { data } = await axios.get(
  //       `${process.env.REACT_APP_API}/route/performance/getSetup/${user.organizationId}`,
  //       {
  //         headers: {
  //           Authorization: authToken,
  //         },
  //       }
  //     );

  //     return data;
  //   },

  // );

  return (
    <div>
      {/* <div className="flex items-center justify-between ">
        <div class="flex  space-y-1 flex-col ">
          <h2 class=" text-2xl tracking-tight">Goal Settings</h2>
          <p class="text-sm text-muted-foreground">
            Manage and organize goals setting
          </p>
        </div>
      </div> */}

      <div className="flex    gap-8">
        <Card
          title={"Performance Period"}
          data={`  ${
            performance?.appraisalStartDate &&
            format(new Date(performance?.appraisalStartDate), "PP")
          } - ${
            performance?.appraisalEndDate &&
            format(new Date(performance?.appraisalEndDate), "PP")
          }`}
        />
        <Card
          title={"Current Cycle Period"}
          data={`${
            performance?.startdate &&
            format(new Date(performance?.startdate), "PP")
          } - ${
            performance?.enddate && format(new Date(performance?.enddate), "PP")
          }`}
        />
        <Card title={"Performance Stage"} data={performance?.stages} />
      </div>

      <Message />

      <GoalsTable performance={performance} isError={isError} />
    </div>
  );
};

export default GoalSettingTab;
