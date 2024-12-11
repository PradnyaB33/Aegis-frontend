import { MoreHoriz } from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { IconButton, Skeleton, Tooltip } from "@mui/material";
import Divider from "@mui/material/Divider";
import axios from "axios";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";

const SummaryTable = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { data, isLoading, isError } = useQuery(
    "employee-summary-table",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getEmployeeSummaryTable`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    }
  );

  if (isLoading) {
    return (
      <article className="w-[300px] h-max py-4 bg-white shadow-xl rounded-lg ">
        <h1 className="text-xl px-8 font-semibold flex items-center gap-3 ">
          <AccountBalanceIcon className="text-gray-400" /> Balance for Leaves
          <Tooltip title="Click to get Salary structure">
            <IconButton>
              <MoreHoriz className="!text-[19px] text-black" />
            </IconButton>
          </Tooltip>
        </h1>
        <Divider
          className="pt-6"
          variant="fullWidth"
          orientation="horizontal"
        />
        <div className="w-full px-6 mt-4 space-y-4 ">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="mt-6">
              <Skeleton variant="text" className="w-[15%] h-6 text-lg " />
              <Skeleton
                variant="text"
                className="w-[25%] !h-8 !mb-4 text-md "
              />
              <Divider variant="fullWidth" orientation="horizontal" />
            </div>
          ))}
        </div>
      </article>
    );
  }

  if (isError) {
    return <p>Error loading data</p>;
  }

  return (
    <article className="w-[350px] h-max bg-white shadow-lg rounded-lg ">
      <h1 className="text-xl py-4 px-6 font-semibold flex items-center gap-3 text-gray-400">
        <AccountBalanceIcon className="text-gray-400" /> Summary for current
        month
      </h1>
      <div className="w-full">
        {data?.leaveTypeDetailsArray?.map((item, index) => {
          if (item.count === 0) {
            return null;
          } else {
            return (
              <div key={index} className="border-b border">
                <div className="flex justify-between items-center py-4 px-6">
                  <h1 className="text-md text-gray-400 font-bold tracking-wide">
                    {item.leaveName}
                  </h1>
                  <h1 className="text-lg tracking-wide font-bold text-gray-400">
                    {item.count}
                  </h1>
                </div>
              </div>
            );
          }
        })}
        <div className="flex justify-between items-center py-4 px-6">
          <h1 className="text-md text-gray-400 font-bold tracking-wide">
            Total Leave Balance
          </h1>
          <h1 className="text-lg tracking-wide text-gray-400">
            {data.totalCoutn}
          </h1>
        </div>
      </div>
    </article>
  );
};

export default SummaryTable;
