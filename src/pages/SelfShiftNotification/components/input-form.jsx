import { Button } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import ShiftRequestCard from "./employee-shift-card";
import ShiftRequestLoaderCard from "./employee-shift-loader";
import useShiftNotificationCount from "../useShiftNotificationCount";

const InputForm = () => {
  const {
    data,
    setMaxDate,
    setMinDate,
    setStatus,
    setSkip,
    skip,
    isLoading,
    isFetching,
  } = useShiftNotificationCount();

  const [month, setMonth] = useState(moment().format("MMMM"));
  const [status, setStatusState] = useState("");

  useEffect(() => {
    // Refetch data with initial state when filters are removed
    if (!month && !status) {
      setMinDate(null);
      setMaxDate(null);
      setStatus(null);
      setSkip(0); // Optionally reset skip to initial state
    }
  }, [month, status, setMinDate, setMaxDate, setStatus, setSkip]);

  console.log(
    `🚀 ~ file: input-form.jsx:126 ~ data?.leaveRequests?.length:`,
    data?.leaveRequests?.length
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="w-full py-4 flex flex-wrap gap-4 justify-between">
        <Select
          value={month ? { label: month, value: month } : null}
          isClearable
          aria-errormessage=""
          placeholder={"Select Months"}
          components={{
            IndicatorSeparator: () => null,
          }}
          className="w-80"
          options={moment.months().map((month) => ({
            label: month,
            value: month,
          }))}
          onChange={(value) => {
            if (!value) {
              setMonth(null);
            } else {
              setMonth(value.value);
              const startDate = moment(value.value, "MMMM").startOf("month");
              const endDate = moment(value.value, "MMMM").endOf("month");
              setMinDate(startDate);
              setMaxDate(endDate);
            }
          }}
        />

        <Select
          value={status ? { label: status, value: status } : null}
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
          ]}
          onChange={(value) => {
            if (!value) {
              setStatusState(null);
            } else {
              setStatusState(value.value);
              setStatus(value.value);
            }
          }}
        />
      </div>

      {(isLoading || isFetching) &&
        [1, 2, 3, 4, 5, 6].map((item) => <ShiftRequestLoaderCard key={item} />)}
      {data?.requests?.map((item, index) => (
        <ShiftRequestCard key={index} items={item} />
      ))}
      {data?.requests?.length < 1 && <h1>Sorry, no request found</h1>}

      <div className="flex justify-between">
        <Button
          variant="contained"
          disabled={skip <= 0}
          onClick={() => {
            setSkip((prev) => Math.max(prev - 1, 0));
          }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setSkip((prev) => prev + 1);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default InputForm;
