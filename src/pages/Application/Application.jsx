import {
  Autorenew,
  CalendarMonth,
  Clear,
  Error,
  PersonOutline,
  Verified,
} from "@mui/icons-material";
import { Button, Chip } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";

const Application = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const [employeeLeaveList, setEmployeeLeaveList] = useState([]);
  console.log(`🚀 ~ employeeLeaveList:`, employeeLeaveList);

  const getEmployeeLeaveList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getEmployeeLeaveList`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(`🚀 ~ response:`, response);

      setEmployeeLeaveList(response.data.employeeLeaveList);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  useEffect(() => {
    getEmployeeLeaveList();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="pt-4 p-4 gap-6 flex flex-col">
      <div className="flex w-full border border-gray-300 shadow-lg rounded-lg p-8 items-center">
        <Link className="" to={"/"}>
          <img
            src="/argan_founder.png"
            alt="user"
            className="!rounded-[50%] border-black border w-24 h-24 object-cover"
          />
        </Link>
        <div className="justify-between flex w-full px-8 items-center">
          <div alt="user" className="rounded-full flex flex-col gap-2">
            <Typography variant="h6" fontWeight="bold">
              Leave Application
            </Typography>
            <div className="flex flex-col gap-2 text-gray-500">
              <div className="flex gap-8">
                <div className="flex gap-1">
                  <PersonOutline />
                  <Typography
                    variant="h7"
                    className="font-light tracking-wider"
                  >
                    Naresh
                  </Typography>
                </div>
                <div className="flex gap-1">
                  <CalendarMonth />
                  <Typography variant="h7" className="font-light">
                    From 14 of july 2023
                  </Typography>
                </div>
                <div className="flex gap-1">
                  <CalendarMonth />
                  <Typography variant="h7" className="font-light">
                    To 14 of july 2023
                  </Typography>
                </div>
              </div>
              <div>
                <Typography variant="h7" className="font-light">
                  Message: Your Leave Application still in Pending State is
                  Rejected from Manager
                </Typography>
              </div>
            </div>
          </div>
          {/* <div className="rounded-full bg-green-400 p-4 h-fit animate-pulse"> */}
          {/* <div className="rounded-full bg-red-400 p-4 h-fit animate-pulse"> */}
          <div className="rounded-full bg-yellow-400 p-4 h-fit animate-pulse">
            {/* <Verified className="text-white !text-[40px] font-bold" /> */}
            {/* <Clear className="text-white !text-[40px] font-bold" /> */}
            <Autorenew className="text-white !text-[40px] font-bold" />
          </div>
        </div>
      </div>
      <div className="flex w-full border border-gray-300 shadow-lg rounded-lg p-8 items-center">
        <Link className="" to={"/"}>
          <img
            src="/argan_founder.png"
            alt="user"
            className="!rounded-[50%] border-black border w-24 h-24 object-cover"
          />
        </Link>
        <div className="justify-between flex w-full px-8 items-center">
          <div alt="user" className="rounded-full flex flex-col gap-2">
            <Typography variant="h6" fontWeight="bold">
              Leave Application
            </Typography>
            <div className="flex flex-col gap-2 text-gray-500">
              <div className="flex gap-8">
                <div className="flex gap-1">
                  <PersonOutline />
                  <Typography
                    variant="h7"
                    className="font-light tracking-wider"
                  >
                    Naresh
                  </Typography>
                </div>
                <div className="flex gap-1">
                  <CalendarMonth />
                  <Typography variant="h7" className="font-light">
                    From 14 of july 2023
                  </Typography>
                </div>
                <div className="flex gap-1">
                  <CalendarMonth />
                  <Typography variant="h7" className="font-light">
                    To 14 of july 2023
                  </Typography>
                </div>
              </div>
              <div>
                <Typography variant="h7" className="font-light">
                  Message: Your Leave Application is Rejected from Manager
                </Typography>
              </div>
              <div>
                <Button color="warning" variant="contained" size="small">
                  Re-Apply
                </Button>
              </div>
            </div>
          </div>
          {/* <div className="rounded-full bg-green-400 p-4 h-fit animate-pulse"> */}
          <div className="rounded-full bg-red-400 p-4 h-fit animate-pulse">
            {/* <div className="rounded-full bg-yellow-400 p-4 h-fit animate-pulse"> */}
            {/* <Verified className="text-white !text-[40px] font-bold" /> */}
            <Clear className="text-white !text-[40px] font-bold" />
            {/* <Autorenew className="text-white !text-[40px] font-bold" /> */}
          </div>
        </div>
      </div>
      <div className="flex w-full border border-gray-300 shadow-lg rounded-lg p-8 items-center">
        <Link className="" to={"/"}>
          <img
            src="/argan_founder.png"
            alt="user"
            className="!rounded-[50%] border-black border w-24 h-24 object-cover"
          />
        </Link>
        <div className="justify-between flex w-full px-8 items-center">
          <div alt="user" className="rounded-full flex flex-col gap-2">
            <Typography variant="h6" fontWeight="bold">
              Leave Application
            </Typography>
            <div className="flex flex-col gap-2 text-gray-500">
              <div className="flex gap-8">
                <div className="flex gap-1">
                  <PersonOutline />
                  <Typography
                    variant="h7"
                    className="font-light tracking-wider"
                  >
                    Naresh
                  </Typography>
                </div>
                <div className="flex gap-1">
                  <CalendarMonth />
                  <Typography variant="h7" className="font-light">
                    From 14 of july 2023
                  </Typography>
                </div>
                <div className="flex gap-1">
                  <CalendarMonth />
                  <Typography variant="h7" className="font-light">
                    To 14 of july 2023
                  </Typography>
                </div>
              </div>
              <div>
                <Typography variant="h7" className="font-light">
                  Message: Your Leave Application Approved from Manager
                </Typography>
              </div>
            </div>
          </div>
          <div className="rounded-full bg-green-400 p-4 h-fit animate-pulse">
            <Verified className="text-white !text-[40px] font-bold" />
          </div>
        </div>
      </div>

      <Box
        className="py-2 min-h-screen bg-gray-50 space-y-5 h-max"
        sx={{
          flexGrow: 1,
          p: 5,
        }}
      >
        {employeeLeaveList.length <= 0 ? (
          <div className="h-max text-red-600 !text-2xl flex items-center gap-4 bg-white py-6 px-8 shadow-lg rounded-lg">
            <Error className="!text-3xl" />
            <h1 className="font-semibold">
              you dont have applied for any application
            </h1>
          </div>
        ) : (
          employeeLeaveList.map((item) => {
            return (
              <Grid
                key={item._id}
                container
                alignItems={"center"}
                spacing={2}
                sx={{
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  borderRadius: "5px",
                }}
              >
                <Grid item xs={8} className="gap-4 py-4 h-max space-y-4">
                  <Box className="flex flex-col gap-2">
                    <Typography variant="h6" fontWeight="light">
                      {`${item.employeeId.first_name} ${item.employeeId.last_name} has raised a leave request for ${item.description}`}
                    </Typography>

                    {item.daysOfLeave.map((day, id) => (
                      <Box key={id}>
                        <Typography variant="body2" color="textSecondary">
                          {`Leave from ${format(
                            new Date(day.start),
                            "PP"
                          )} to ${format(new Date(day.end), "PP")}`}
                        </Typography>
                      </Box>
                    ))}
                    <Typography
                      variant="body2"
                      color="textPrimary"
                      className=" italic"
                    >
                      {item.message}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  display={"flex"}
                  justifyContent={"center"}
                  spacing={2}
                  item
                  xs={4}
                >
                  {item.status === "Rejected" ? (
                    <Chip label={item.status} color="error" />
                  ) : item.status === "Approved" ? (
                    <Chip label={item.status} color="success" />
                  ) : (
                    <Chip
                      label={"you request is in pending status"}
                      color="primary"
                    />
                  )}
                </Grid>
              </Grid>
            );
          })
        )}
      </Box>
    </div>
  );
};

export default Application;
