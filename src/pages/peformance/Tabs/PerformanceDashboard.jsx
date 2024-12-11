import { Check, Info } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import React, { useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import usePerformanceApi from "../../../hooks/Performance/usePerformanceApi";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import { TestContext } from "../../../State/Function/Main";
import Card from "../components/Card";
import DashboardTable from "../components/Dashboard/DashboardTable";
import Message from "../components/Message";

const PerformanceDashboard = () => {
  const user = UserProfile().getCurrentUser();
  const role = UserProfile().useGetCurrentRole();
  const { handleAlert } = useContext(TestContext);

  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const {
    fetchPerformanceSetup,
    // getPerformanceDashboardTable,
    getEmployeePerformance,
    getPerformanceTable,
    changeStatus,
  } = usePerformanceApi();
  const { data: performance } = useQuery(["performancePeriod"], () =>
    fetchPerformanceSetup({ user, authToken })
  );

  const { data: tableData, isFetching: tableFetching } = useQuery(
    {
      queryKey: ["performanceDashTable"],
      queryFn: () => getPerformanceTable({ authToken, role, organisationId }),
    },
    { enabled: role === "Manager" || role === "HR" || role === "Super-Admin" }
  );

  const goalStatusCounts =
    tableData?.length <= 0
      ? []
      : tableData?.reduce((acc, record) => {
          if (record.goals && record.goals.length) {
            record.goals.forEach((goal) => {
              const today = new Date();
              const endDate = new Date(goal.endDate);
              if (!acc["total"]) {
                acc["total"] = 0;
              }
              acc["total"]++;
              if (endDate < today) {
                // Count as overdue
                if (!acc["overdue"]) {
                  acc["overdue"] = 0;
                }
                acc["overdue"]++;
              } else {
                // Count as per goalStatus
                if (goal.goalStatus) {
                  if (!acc[goal.goalStatus]) {
                    acc[goal.goalStatus] = 0;
                  }
                  acc[goal.goalStatus]++;
                }
              }
            });
          }
          return acc;
        }, {});

  const { data: selfGoals } = useQuery(
    ["selfData"],
    () => getEmployeePerformance({ id: user._id, authToken }),
    { enabled: role === "Employee" }
  );

  const statusCounts = selfGoals?.goals?.reduce((acc, goal) => {
    const { goalStatus, endDate } = goal;
    const today = new Date();
    const goalEndDate = new Date(endDate);

    // Check if the goal is overdue and increment 'Overdue' count accordingly
    if (goalEndDate < today) {
      acc["Overdue"] = (acc["Overdue"] || 0) + 1;
    } else {
      // Increment count for the existing status
      if (acc[goalStatus]) {
        acc[goalStatus] += 1;
      } else {
        acc[goalStatus] = 1; // Initialize count for new status
      }
    }

    return acc;
  }, {}); // Initial accumulator is an empty object

  const changePassword = useMutation(
    (status) => {
      changeStatus({ status, empId: user._id, authToken });
    },
    {
      onSuccess: (data) => {
        handleAlert(true, "success", "Status changed successfully");
      },
    }
  );

  console.log(changePassword.isLoading);

  return (
    <>
      {changePassword.isLoading && (
        <div className=" z-[10000] flex items-center justify-center h-screen w-full bg-black/20 fixed top-0 bottom-0 left-0 right-0">
          <CircularProgress />
        </div>
      )}

      <div>
        {/* <div class="flex items-center justify-between ">
          <div class="space-y-1">
            <h2 class="text-2xl tracking-tight">Dashboard</h2>
            <p class="text-sm text-muted-foreground">
              Manage and organize goals setting
            </p>
          </div>
        </div> */}

        <div className="flex flex-wrap gap-4">
          <Card
            title={"Total Goals"}
            data={
              role === "Employee"
                ? `${statusCounts?.Completed ?? 0} / ${
                    selfGoals?.goals?.length ?? 0
                  } completed`
                : `${goalStatusCounts?.Completed ?? 0} / ${
                    goalStatusCounts?.total ?? 0
                  } completed`
            }
          />
          <Card
            title={"Total Overdue Goals"}
            data={
              role === "Employee"
                ? statusCounts?.Overdue ?? 0
                : goalStatusCounts?.overdue ?? 0
            }
          />
          <Card title={"Current Stage"} data={performance?.stages} />
          <Card
            title={"Timeline"}
            data={`${
              performance?.startdate &&
              format(new Date(performance?.startdate), "PP")
            } - 
                ${
                  performance?.enddate &&
                  format(new Date(performance?.enddate), "PP")
                }`}
          />
        </div>

        <Message />

        {(role === "Manager" || role === "Super-Admin" || role === "HR") && (
          <div className="my-4">
            <DashboardTable
              tableData={tableData}
              tableFetching={tableFetching}
              role={role}
              performance={performance}
            />
          </div>
        )}

        {role === "Employee" && (
          <div className="flex justify-start my-3  gap-4">
            {/* <aside className="flex bg-white  border rounded-md ">
            <div className="w-[500px] rounded-sm p-4">
              <h1 className="text-lg  font-bold text-[#67748E]">Goals chart</h1>
              <EmpGraph goalsData={statusCounts} />
            </div>
          </aside> */}
            {performance?.stages ===
              "Employee acceptance/acknowledgement stage" && (
              <div className="min-w-[350px] bg-blue-50 h-max   w-max border rounded-md">
                <div className=" px-4 py-3 grid  gap-2  rounded-lg leading-none  ">
                  <div>
                    <h1 className="font-semibold text-lg  text-black/80 ">
                      Rating from manager
                    </h1>
                    <p className="text-lg tracking-tight ">
                      {selfGoals?.managerRating}
                    </p>
                  </div>
                  <div>
                    <h1 className="font-semibold text-lg text-black/80 ">
                      Review from manager
                    </h1>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(selfGoals?.managerFeedback),
                      }}
                      className="text-lg  tracking-tight "
                    />
                  </div>

                  {selfGoals?.isRevaluation}

                  {selfGoals?.isRevaluation === "To Do" ||
                  selfGoals?.isRevaluation === "Rejected" ? (
                    <footer className="flex gap-2">
                      <button
                        onClick={() => changePassword.mutate("Accepted")}
                        className="text-white bg-blue-500 px-4 py-2 rounded-md"
                      >
                        Accept Rating
                      </button>
                      <button
                        onClick={() => changePassword.mutate("Pending")}
                        className="text-white bg-orange-500 px-4 py-2 rounded-md"
                      >
                        Request for revaluation
                      </button>
                    </footer>
                  ) : (
                    <>
                      {selfGoals?.isRevaluation === "Accepted" ? (
                        <p className="text-green-500 text-lg font-bold">
                          <Check /> {selfGoals?.isRevaluation}
                        </p>
                      ) : selfGoals?.isRevaluation === "Pending" ? (
                        <p className="text-gray-500 text-lg font-bold">
                          <Info /> {selfGoals?.isRevaluation}
                        </p>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PerformanceDashboard;
