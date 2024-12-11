import { format } from "date-fns";
import React from "react";
import { useQuery } from "react-query";
import usePerformanceApi from "../../../hooks/Performance/usePerformanceApi";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import Message from "../components/Message";
import ReviewTable from "../components/Review/ReviewTable";
const ReviewTab = () => {
  const authToken = useAuthToken();

  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();

  const { fetchPerformanceSetup, getPerformanceDashboardTable } =
    usePerformanceApi();

  const { data: tableData, isFetching } = useQuery(["dashboardTable"], () =>
    getPerformanceDashboardTable({ role, authToken })
  );

  const { data: performance } = useQuery(["performancePeriod"], () =>
    fetchPerformanceSetup({ user, authToken })
  );

  return (
    <div>
      <div className="flex items-center justify-between ">
        <div class="flex items-center justify-between ">
          <div class="space-y-1">
            <h2 class=" text-2xl tracking-tight">Review & Rating</h2>
            <p class="text-sm text-muted-foreground">
              Review and rate your employees
            </p>
          </div>
        </div>
      </div>

      <Message />

      <div className="flex  pb-4  gap-8">
        <div className="min-w-[250px] border rounded-md">
          <div className=" px-4 py-3 bg-white  rounded-lg leading-none flex items-top justify-start space-x-6">
            <div className="space-y-1">
              <h1 className=" font-semibold text-[#67748E] ">
                Performance Period
              </h1>
              <p className="text-md  tracking-tight ">
                {performance?.appraisalStartDate &&
                  format(new Date(performance?.appraisalStartDate), "PP")}{" "}
                -{" "}
                {performance?.appraisalEndDate &&
                  format(new Date(performance?.appraisalEndDate), "PP")}
              </p>
            </div>
          </div>
        </div>
        <div className="min-w-[250px] border rounded-md">
          <div className=" px-4 py-3 bg-white  rounded-lg leading-none flex items-top justify-start space-x-6">
            <div className="space-y-1">
              <h1 className="font-semibold text-[#67748E] ">
                Current Cycle Period
              </h1>
              <p className="text-md  tracking-tight ">
                {performance?.startdate &&
                  format(new Date(performance?.startdate), "PP")}{" "}
                -{" "}
                {performance?.enddate &&
                  format(new Date(performance?.enddate), "PP")}
              </p>
            </div>
          </div>
        </div>
        <div className="min-w-[250px] border rounded-md">
          <div className=" px-4 py-3 bg-white  rounded-lg leading-none flex items-top justify-start space-x-6">
            <div className="space-y-1">
              <h1 className="font-semibold text-[#67748E] ">
                Performance Stage
              </h1>
              <p className="text-md  tracking-tight ">{performance?.stages}</p>
            </div>
          </div>
        </div>
      </div>

      <ReviewTable
        tableData={tableData}
        performance={performance}
        isFetching={isFetching}
      />
    </div>
  );
};

export default ReviewTab;
