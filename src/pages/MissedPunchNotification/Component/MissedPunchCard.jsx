import Info from "@mui/icons-material/Info";
import { Box, Grid } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";

const MissedPunchCard = ({ items }) => {
  // to define the state
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");

  // to define the functin for time
  const getTimeAgo = (updatedAt) => {
    const now = new Date();
    const updatedTime = new Date(updatedAt);
    const elapsedMilliseconds = now - updatedTime;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    if (elapsedSeconds < 60) {
      return `${elapsedSeconds} seconds`;
    } else if (elapsedSeconds < 3600) {
      const minutes = Math.floor(elapsedSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else if (elapsedSeconds < 86400) {
      const hours = Math.floor(elapsedSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      const days = Math.floor(elapsedSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""}`;
    }
  };

  // to define the function change the time
  const handleTimePeriodChange = (event) => {
    setSelectedTimePeriod(event.target.value);
  };
  
  // to filter the data 
  const filteredMissedPunchData = () => {
    if (!items || !Array.isArray(items.unavailableRecords)) {
      return [];
    }
    const records = items.unavailableRecords;
    if (selectedTimePeriod === "all") {
      return records;
    } else {
      return records.filter((record) => record.status === selectedTimePeriod);
    }
  };

  return (
    <Box
      className="py-2 space-y-5 h-max"
      sx={{
        flexGrow: 1,
      }}
    >
      <Grid
        container
        spacing={2}
        className="bg-white w-full"
        sx={{
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          borderRadius: "5px",
        }}
      >
        <article className=" bg-white w-full h-max shadow-md rounded-sm border items-center">
          <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <label htmlFor="statusDropdown">Select Status: </label>
              <select
                id="statusDropdown"
                value={selectedTimePeriod}
                onChange={handleTimePeriodChange}
                className="bg-white border rounded-lg px-3 py-2 outline-none "
                style={{ width: "300px" }}
              >
                <option value="all">All</option>
                <option value="Available">Available</option>
                <option value="Leave">Leave</option>
              </select>
            </div>
          </div>
          {filteredMissedPunchData().length > 0 ? (
            filteredMissedPunchData().map((record, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 shadow-md mt-4"
              >
                <div className="flex justify-between items-center w-full">
                  <h1 className="text-xl px-4 md:px-0 font-semibold order-1 md:order-1">
                    {record.status === "Available"
                      ? `${moment(record.recordDate).format(
                          "YYYY-MM-DD"
                        )}   This unavailable record is approved as available`
                      : `${moment(record.recordDate).format(
                          "YYYY-MM-DD"
                        )} This unavailable record is approved as a leave.`}
                  </h1>
                  <p className="text-md px-4 md:px-0 order-2 md:order-2 mr-2">
                    Updated {getTimeAgo(record.updatedAt)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">No Notifications</h1>
              </article>
              <p>No notifications found.</p>
            </section>
          )}
        </article>
      </Grid>
    </Box>
  );
};

export default MissedPunchCard;
