import { MoreHoriz, MoreVert } from "@mui/icons-material";
import { Avatar, IconButton, Popover, Skeleton, Tooltip } from "@mui/material";
import Divider from "@mui/material/Divider";
import React, { useState } from "react";
import UserProfile from "../../../hooks/UserData/useUser";
import SummaryTable from "./summaryTable";

const LeaveTable = ({ data, isLoading, balenceLoading }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  if (isLoading || balenceLoading) {
    return (
      <article className="w-full  px-6 h-max py-6   ">
        <div className="text-lg  font-semibold flex  text-gray-700">
          <div className="flex gap-2">
            <h1 className="text-gray-500 text-xl font-bold tracking-tight">
              Balance Leaves
            </h1>
          </div>
          <Tooltip title="Click to get Summary for current month">
            <IconButton className="">
              <MoreHoriz className="text-black" />
            </IconButton>
          </Tooltip>
        </div>
        <Divider className="mt-4 mb-6" />
        <div className="px-6 space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="space-y-2">
              <Skeleton variant="text" className="w-1/4 h-6" />
              <Skeleton variant="text" className="w-2/4 h-8" />
              <Divider />
            </div>
          ))}
        </div>
      </article>
    );
  }

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <article className="w-full flex justify-between flex-col h-auto  md:h-[90vh] ">
      <aside>
        <h1 className="text-lg  font-semibold flex items-center gap-2 justify-between ">
          <div className="gap-2 p-4  flex">
            <h1 className="text-gray-500 pt-2 text-xl font-bold tracking-tight">
              Balance Leaves
            </h1>
          </div>
          <Tooltip title="Click to get Summary for current month">
            <IconButton
              onClick={handlePopoverOpen}
              className="transition-transform transform hover:scale-110"
            >
              <MoreVert className="text-black" />
            </IconButton>
          </Tooltip>
        </h1>

        <div className="mt-2 px-4">
          {data?.leaveTypes?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center  py-2 px-0 rounded-lg mb-2  "
            >
              <div className="gap-2 flex items-center">
                <span
                  style={{ backgroundColor: item.color }}
                  className="h-4 w-4 rounded-full"
                ></span>

                <div style={{ width: "100px" }}>
                  <h2 className="text-md font-medium text-gray-800">
                    {item.leaveName}
                  </h2>
                </div>
              </div>
              <h2 className="text-md font-semibold text-gray-900">
                {item.count}
              </h2>
            </div>
          ))}

          <div className="flex justify-between items-center py-2 px-0 border-t border-gray-300">
            <h2 className="text-md font-medium text-gray-800">
              Total Leave Balance
            </h2>
            <h2 className="text-md font-semibold text-gray-900">
              {data.totalCoutn}
            </h2>
          </div>
        </div>

        <div className="flex gap-4 flex-col justify-between py-2 mt-2 px-4 border-t border-gray-300">
          <div className="flex gap-2 my-1">
            <h1 className="text-gray-500 text-xl mb-2 font-bold tracking-tight">
              Monthly Summary
            </h1>
          </div>
          <div className="flex w-ful justify-between ">
            <h2 className="text-md font-medium text-gray-800">
              Leaves Taken in this month
            </h2>
            <h2 className="text-md font-semibold text-gray-900">
              {data?.totalLeavesTaken}
            </h2>
          </div>
          <div className="flex w-ful justify-between ">
            <h2 className="text-md font-medium text-gray-800">
              Available Days
            </h2>
            <h2 className="text-md font-semibold text-gray-900">
              {data?.presentDays}
            </h2>
          </div>
        </div>
      </aside>

      {role !== "Employee" && (
        <div className=" bg-white !px-4 py-2 border-t w-full">
          <div className="  w-full rounded-md     !py-2 !px-4 items-center flex gap-4 ">
            <Avatar
              variant="circular"
              src={data?.employee?.user_logo_url}
              alt="none"
              sx={{ width: 60, height: 60 }}
            />
            <div>
              <h1 className="font-bold text-xl tracking-tighter  text-gray-600">
                {data?.employee?.first_name} {data?.employee?.last_name}
              </h1>
              <h1>{data?.employee?.email}</h1>
            </div>
          </div>
        </div>
      )}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className="transition-transform transform scale-95"
      >
        <SummaryTable />
      </Popover>
    </article>
  );
};

export default LeaveTable;
