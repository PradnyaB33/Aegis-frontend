import { Box, Container, Grid, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import usePayslipNotificationHook from "../../hooks/QueryHook/notification/PayslipNotification/usePayslipNotificaitonHook";

const PayslipNotification = () => {
  const {
    PayslipNotificationCount,
    isLoading,
    isCountLoading,
    isError,
    isCountError,
  } = usePayslipNotificationHook();

  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value ? dayjs(event.target.value) : null);
  };

  const monthFromSelectedDate = selectedDate ? selectedDate.format("M") : null;
  const yearFromSelectedDate = selectedDate ? selectedDate.format("YYYY") : null;

  const filteredPayslip = selectedDate
    ? PayslipNotificationCount?.find(
      (payslip) =>
        payslip.month === parseInt(monthFromSelectedDate) &&
        payslip.year === parseInt(yearFromSelectedDate)
    )
    : null;

  const getMonthName = (monthNumber) => {
    return dayjs().month(monthNumber - 1).format("MMMM");
  };

  if (isLoading || isCountLoading) {
    return <CircularProgress />; // Loading Spinner
  }

  if (isError || isCountError) {
    return <div>Sorry, an error occurred while fetching notifications.</div>; // Error Handling
  }

  return (
    <Container maxWidth="xl" className="bg-gray-50 min-h-screen mt-4">
      <article className="bg-white w-full h-max shadow-md rounded-sm border items-center">
        <h1 className="w-full pt-5 text-xl font-bold px-14 py-3 shadow-md bg-white border-b border-gray-300">
          Payslip Notifications
          <p className="text-sm font-extralight">
            Here employees can check the status of their payslip requests
          </p>
        </h1>
        <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
          <div className="flex flex-col gap-3 mb-3 md:mb-0">
            <h1 className="w-full pt-5 text-xl font-bold px-10 py-3 bg-white">
              Please select the month
            </h1>
            <div className="px-10">
              <input
                type="month"
                value={selectedDate ? selectedDate.format("YYYY-MM") : ""}
                onChange={handleDateChange}
                style={{ width: "500px" }}
                className="border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>
        {filteredPayslip ? (
          <div className="p-4 px-12">
            <Grid item className="gap-1 py-4 w-full h-max space-y-4">
              <Box className="flex md:flex-row items-center justify-center flex-col gap-8 md:gap-16">
                <div className="space-y-4 w-full flex flex-col items-center md:items-start justify-center">
                  <h1 className="text-xl px-4 md:!px-0 font-semibold">
                    Your salary calculated for {getMonthName(filteredPayslip.month)} {filteredPayslip.year}
                  </h1>
                </div>
              </Box>
            </Grid>
          </div>
        ) : selectedDate ? (
          <div className="p-4 px-12">
            <h1>Sorry, no request found</h1>
          </div>
        ) : (
          <div className="p-4 px-11">
            {PayslipNotificationCount && PayslipNotificationCount.length > 0 ? (
              PayslipNotificationCount.map((payslip) => (
                <div key={payslip._id} className="mb-4">
                  <Grid item className="gap-1 py-4 w-full h-max space-y-4">
                    <Box className="flex md:flex-row items-center justify-center flex-col gap-8 md:gap-16">
                      <div className="space-y-4 w-full flex flex-col items-center md:items-start justify-center">
                        <h1 className="text-xl px-4 md:!px-0 font-semibold">
                          Your salary calculated for {getMonthName(payslip.month)} {payslip.year}
                        </h1>
                      </div>
                    </Box>
                  </Grid>
                </div>
              ))
            ) : (
              <div className="p-4 px-12">
                <h1>Sorry, no request found</h1>
              </div>
            )}
          </div>
        )}
      </article>
    </Container>
  );
};

export default PayslipNotification;

