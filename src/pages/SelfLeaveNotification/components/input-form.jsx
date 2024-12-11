import { Button } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import Select from "react-select";
import useLeaveData from "../../../hooks/Leave/useLeaveData";
import useLeaveRequesationHook from "../../../hooks/QueryHook/Leave-Requsation/hook";
import LeaveRequestCard from "./employee-leave-card";
import LeaveRequestLoaderCard from "./employee-leave-loader";
import useLeaveNotificationCount from "../UseLeaveNotificationCout";

const InputForm = () => {
  const {
    data,
    setMaxDate,
    setMinDate,
    setStatus,
    setLeaveTypeDetailsId,
    setSkip,
    skip,
    isLoading,
    leaveTypeDetails,
    isFetching,
  } = useLeaveNotificationCount();

  const { data: leaveMain2 } = useLeaveData();
  const { data: leaveMain } = useLeaveRequesationHook();
  const [month, setMonth] = useState(moment().format("MMMM"));

  return (
    <>
      <div className="flex w-full flex-col gap-2 p-2">
        <div className="w-full py-4 flex flex-wrap gap-4 justify-between">
          <Select
            value={{ label: month, value: month }}
            isClearable
            aria-errormessage=""
            placeholder={"Select Months"}
            components={{
              IndicatorSeparator: () => null,
            }}
            className="w-80"
            options={moment.months().map((month, index) => ({
              label: month,
              value: month,
            }))}
            onChange={(value) => {
              // setMonth(value.value);
              if (value === null) {
                return setMonth(undefined);
              }
              setMonth(value.value);
              // get start date of month
              const startDate = moment(value.value, "MMMM").startOf("month");
              // get end date of month
              const endDate = moment(value.value, "MMMM").endOf("month");
              setMinDate(startDate);
              setMaxDate(endDate);
            }}
          />
          {leaveMain2?.LeaveTypedEdited && leaveMain?.leaveTypes && (
            <Select
              value={leaveTypeDetails}
              isClearable
              className="min-w-60 z-50"
              aria-errormessage=""
              placeholder={"Select attendace type"}
              components={{
                IndicatorSeparator: () => null,
              }}
              options={[...leaveMain2?.LeaveTypedEdited].map((month) => ({
                label: month?.leaveName,
                value: month?._id,
              }))}
              onChange={(value) => {
                if (value === null) {
                  return setLeaveTypeDetailsId("");
                }
                setLeaveTypeDetailsId(value.value);
              }}
            />
          )}
          <Select
            isClearable
            className="min-w-60 z-50"
            aria-errormessage=""
            placeholder={"Select status"}
            components={{
              IndicatorSeparator: () => null,
            }}
            options={[
              { label: "Approved", value: "Approved" },
              { label: "Rejected", value: "Rejected" },
              { label: "Pending", value: "Pending" },
            ].map((month) => ({
              label: month?.label,
              value: month?.value,
            }))}
            onChange={(value) => {
              if (value === null) {
                return setStatus("");
              }
              setStatus(value.value);
            }}
          />
        </div>
        {(isLoading || isFetching) &&
          [1, 2, 3, 4, 5, 6].map((item) => (
            <LeaveRequestLoaderCard key={item} />
          ))}
        {data?.leaveRequests?.map((item, index) => (
          <LeaveRequestCard key={index} items={item} />
        ))}
        {data?.leaveRequests?.length < 1 && <h1>Sorry no request found</h1>}

        <div className="flex justify-between">
          <Button
            variant="contained"
            disabled={skip > 0 ? false : true}
            onClick={() => {
              setSkip((prev) => prev - 1);
            }}
          // type="button"
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setSkip((prev) => prev + 1);
            }}
          // type="button"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default InputForm;
