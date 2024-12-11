import { Close } from "@mui/icons-material";
import { Button, MenuItem, Popover, Select } from "@mui/material";
import moment from "moment";
import { momentLocalizer } from "react-big-calendar";
import { useQuery, useQueryClient } from "react-query";

import axios from "axios";
import { differenceInDays, format, parseISO } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";

const AppDatePicker = ({
  data,
  leaveData,
  newData,
  setNewData,
  handleUpdateFunction,
  setNamesArray,
  selectEvent,
  setselectEvent,
  setCalendarOpen,
  setNewAppliedLeaveEvents,
  selectedLeave,
  setSelectedLeave,
  newAppliedLeaveEvents,
  isCalendarOpen,
  disabledShiftId,
  setUpdateId,
}) => {
  const localizer = momentLocalizer(moment);
  const { handleAlert } = useContext(TestContext);
  const [selectedEventsToUpdate, setSelectedEventsToUpdate] = useState();
  // const [newData, setNewData] = useState([]);
  // const [newLeave, setNewLeave] = useState([]);
  const queryClient = useQueryClient();
  const { cookies } = useContext(UseContext);
  const { setAppAlert } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const arr = data;
  console.log("data", data);

  useEffect(() => {
    const arrayOfData = arr && arr.requests ? arr.requests : [];
    const newArr = arrayOfData.filter((item) => {
      return item._id !== disabledShiftId;
    });
    setNewData(newArr);
    // eslint-disable-next-line
  }, [disabledShiftId, arr]);

  console.log("my shiftData", newData);
  useEffect(() => {
    console.log("selected leave", selectedLeave);
  }, [selectedLeave]);

  const getLatestShifts = async () => {
    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/shiftApply/get`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setNewData(resp.data.requests);
      queryClient.invalidateQueries("employee-leave-table-without-default");
    } catch (error) {
      console.error(error.message);
    }
  };
  const getLatestLeave = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API}/route/leave/allLeaves`, {
        headers: {
          Authorization: authToken,
        },
      });
      // setNewLeave(resp.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const { data: data2 } = useQuery("employee-disable-weekends", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/weekend/get`,
      {
        headers: { Authorization: authToken },
      }
    );

    return response.data;
  });
  const handleSelectEvent = (event, eventId) => {
    setUpdateId(eventId);
    console.log("this is main event", event);
    console.log("Selected Event ID:", eventId);
    if (event.title === "Selected Leave") {
      const filteredEvents = newAppliedLeaveEvents.filter(
        (item) => item.title !== "Selected Leave"
      );
      setNewAppliedLeaveEvents(filteredEvents);
    }
    setSelectedLeave(event);
    setSelectedEventsToUpdate(event);
    setCalendarOpen(true);
    console.log("title", event.title);
    if (event.title === "Selected Leave") {
      // Additional logic if needed
    } else {
      // Additional logic if needed
    }
  };
  const dayPropGetter = (date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });

    const isDisabled = data2?.days?.days?.some((day) => {
      return day.day === dayOfWeek;
    });
    if (isDisabled) {
      return {
        style: {
          pointerEvents: "none",
          backgroundColor: "#f7bfbf",
        },
      };
    }

    return {};
  };

  const handleSelectSlot = ({ start, end, _id }) => {
    getLatestShifts();
    getLatestLeave();
    const selectedStartDate = moment(start).startOf("day");
    const selectedEndDate = moment(end).startOf("day").subtract(1, "day");
    // const difference = selectedEndDate.diff(selectedStartDate, "days");

    // if (newData && Array.isArray(newData)) {
    //   const isOverlapWithData = newData.some((event) => {
    //     console.log(newData);
    //     const eventStartDate = moment(event.start);
    //     const eventEndDate = moment(event.end);

    //     return (
    //       (moment(start).isSameOrAfter(eventStartDate) &&
    //         moment(start).isBefore(eventEndDate)) ||
    //       (moment(end).isAfter(eventStartDate) &&
    //         moment(end).isSameOrBefore(eventEndDate)) ||
    //       (moment(start).isSameOrBefore(eventStartDate) &&
    //         moment(end).isSameOrAfter(eventEndDate))
    //     );
    //   });

    //   if (isOverlapWithData) {
    //     return handleAlert(
    //       true,
    //       "error",
    //       "This slot overlaps with an existing event."
    //     );
    //   }
    // }

    const isOverlap = [
      ...leaveData?.currentYearLeaves,
      ...newAppliedLeaveEvents,
      ...newData,
    ].some((range) => {
      // Convert range start and end dates to Moment.js objects
      const rangeStart = range.start;
      const rangeEnd = moment(range.end).startOf("day").subtract(1, "days");

      // Check if selected start date is between any existing range
      const isStartBetween = selectedStartDate.isBetween(
        rangeStart,
        rangeEnd,
        undefined,
        "[)"
      );

      // Check if selected end date is between any existing range
      const isEndBetween = selectedEndDate.isBetween(
        rangeStart,
        rangeEnd,
        undefined,
        "(]"
      );

      // Check if selected start and end date overlaps with any existing range

      const isOverlap =
        selectedStartDate.isSameOrBefore(rangeEnd) &&
        selectedEndDate.isSameOrAfter(rangeStart);
      // Return true if any overlap is found
      return isStartBetween || isEndBetween || isOverlap;
    });

    if (isOverlap) {
      return handleAlert(
        true,
        "warning",
        "You have already selected this shift"
      );
    } else {
      const newShift = {
        title: selectEvent ? "Updated Shift" : "Selected Shift",
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        color: selectEvent ? "black" : "blue", // Set background color to black for updated shift
      };

      // Update state accordingly
      setNewAppliedLeaveEvents((prevEvents) => [...prevEvents, newShift]);
      setSelectedLeave(selectEvent ? null : newShift);
      setselectEvent(false);
    }
  };

  const CustomToolbar = (toolbar) => {
    const handleMonthChange = (event) => {
      const newDate = moment(toolbar.date).month(event.target.value).toDate();
      toolbar.onNavigate("current", newDate);
    };

    const handleYearChange = (event) => {
      const newDate = moment(toolbar.date).year(event.target.value).toDate();
      toolbar.onNavigate("current", newDate);
    };

    return (
      <>
        <div className="flex-row-reverse flex gap-4 items-center">
          <Button
            // variant="outlined"
            color="error"
            className="!h-full hover:!bg-[#da4f4f] hover:!text-white"
            size="small"
            onClick={() => setCalendarOpen(false)}
          >
            <Close />
          </Button>
          <Select
            className="m-2"
            size="small"
            value={moment(toolbar.date).month()}
            onChange={handleMonthChange}
          >
            {moment.months().map((month, index) => (
              <MenuItem key={index} value={index}>
                {month}
              </MenuItem>
            ))}
          </Select>
          <Select
            className="m-2"
            size="small"
            value={moment(toolbar.date).year()}
            onChange={handleYearChange}
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <MenuItem key={index} value={moment(toolbar.date).year() + index}>
                {moment(toolbar.date).year() + index}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="flex w-full flex-row-reverse px-3 text-red-500 italic font-extrabold text-xs h-[20px]">
          {selectedLeave && selectEvent ? (
            differenceInDays(
              parseISO(selectedEventsToUpdate?.end),
              parseISO(selectedEventsToUpdate?.start)
            ) !== 1 ? (
              <h1>
                Updating existing entry from{" "}
                {console.log("my selected shift bro", selectedLeave)}
                {selectedEventsToUpdate?.start &&
                  format(
                    new Date(selectedEventsToUpdate?.start),
                    "dd-MM-yyyy"
                  )}{" "}
                to{" "}
                {selectedEventsToUpdate?.end &&
                  moment(selectedEventsToUpdate?.end)
                    .subtract(1, "days")
                    .format("DD-MM-YYYY")}
              </h1>
            ) : (
              <h1>
                Updating existing entry of{" "}
                {selectedEventsToUpdate?.start &&
                  format(new Date(selectedEventsToUpdate?.start), "dd-MM-yyyy")}
              </h1>
            )
          ) : (
            selectedLeave?.status &&
            !selectedLeave?.color && (
              <div className="text-center font-semibold">
                The application for this shift is{" "}
                <span
                  style={{
                    color:
                      selectedLeave.status === "Approved"
                        ? "green"
                        : selectedLeave.status === "Pending"
                          ? "#f2a81b"
                          : selectedLeave.status === "Rejected"
                            ? "red"
                            : "Yellow",
                  }}
                >
                  {selectedLeave.status}
                </span>
              </div>
            )
          )}
        </div>
      </>
    );
  };
  const handleClickAway = (event) => {
    const clickableElements = document.querySelectorAll(`.rbc-event-content`);

    if (
      !Array.from(clickableElements).some((element) =>
        element.contains(event.target)
      )
    ) {
    } else {
    }
  };
  const handleDelete = async () => {
    console.log("selectedLeave", selectedLeave);
    try {
      // if (selectedLeave.status === "Approved") {
      //   setAppAlert({
      //     alert: true,
      //     type: "error",
      //     msg: "Cannot Delete Approved Shift",
      //   });
      //   return;
      // }
      if (selectedLeave._id) {
        await axios.delete(
          `${process.env.REACT_APP_API}/route/shiftApply/delete/${selectedLeave._id}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        setNewAppliedLeaveEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== selectedLeave._id)
        );
        getLatestShifts();
        queryClient.invalidateQueries("employee-leave-table-without-default");

        setSelectedLeave(null); // Reset selectedLeave state
        queryClient.invalidateQueries("table");
        queryClient.invalidateQueries("table");
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Request Deleted Successfully",
        });
      } else if (selectedLeave) {
        setNewAppliedLeaveEvents((prevEvents) =>
          prevEvents.filter(
            (event) =>
              event.title !== selectedLeave.title ||
              event.start !== selectedLeave.start ||
              event.end !== selectedLeave.end
          )
        );
      } else {
      }
    } catch (error) {
      console.error("Error deleting shift:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: error.response.data.message,
      });
    }
  };

  useEffect(() => {
    // Add click event listener when component mounts
    document.addEventListener("click", handleClickAway);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickAway);
    };
  }, []);
  return (
    <Popover
      PaperProps={{
        className:
          "w-full xl:w-[400px] xl:h-[470px] !bottom-0 !p-0 flex flex-col justify-between",
      }}
      open={isCalendarOpen}
      onClose={() => setCalendarOpen(false)}
      components={{
        toolbar: CustomToolbar,
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      style={{ height: "500px !important" }}
    >
      <div className=" bg-white shadow-lg z-10">
        <div className="w-full">
          <Calendar
            localizer={localizer}
            views={["month"]}
            components={{
              toolbar: CustomToolbar,
            }}
            events={
              data && leaveData
                ? [
                  ...newData,
                  ...leaveData?.currentYearLeaves,
                  ...newAppliedLeaveEvents,
                ]
                : [...newAppliedLeaveEvents]
            }
            startAccessor="start"
            endAccessor="end"
            style={{
              height: "400px",
              width: "100%",
              background: "#fff",
            }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={(event) => handleSelectEvent(event, event._id)}
            datePropGetter={selectedLeave}
            dayPropGetter={dayPropGetter}
            eventPropGetter={(event) => {
              let backgroundColor = "blue";
              if (event.title === "Updated Shift") {
                backgroundColor = "black";
              }

              // if (event?.status) {
              //   switch (event.status) {
              //     case "Pending":
              //       backgroundColor = "orange";
              //       break;
              //     case "Rejected":
              //       backgroundColor = "red";
              //       break;
              //     case "Approved":
              //       backgroundColor = "green";
              //       break;
              //     default:
              //       backgroundColor = "blue";
              //       break;
              //   }
              // }
              if (event?.status && event?.accountantStatus) {
                switch (true) {
                  case event.status === "Pending" && event.accountantStatus === "Pending":
                    backgroundColor = "orange";
                    break;
                  case event.status === "Approved" && event.accountantStatus === "Pending":
                    backgroundColor = "orange";
                    break;
                  case event.status === "Rejected" && event.accountantStatus === "Pending":
                    backgroundColor = "red";
                    break;
                  case event.status === "Approved" && event.accountantStatus === "Rejected":
                    backgroundColor = "red";
                    break;
                  case event.status === "Approved" && event.accountantStatus === "Approved":
                    backgroundColor = "green";
                    break;
                  default:
                    backgroundColor = "blue";
                    break;
                }
              }
              if (event.color) {
                backgroundColor = event.color;
              }

              return {
                style: {
                  backgroundColor,
                },
              };
            }}
          />
        </div>
      </div>

      <div className="!px-4 !py-2 bg-white flex justify-between">
        <Button variant="contained" onClick={() => setCalendarOpen(false)}>
          Submit
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            await handleUpdateFunction();
          }}
          className="rbc-event-content"
          disabled={selectedLeave?.color}
        >
          Update
        </Button>

        {selectedLeave?.title === "Selected Shift" ? (
          <Button
            variant="contained"
            onClick={handleDelete}
            className="rbc-event-content"
          >
            Delete
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleDelete}
            className="rbc-event-content"
            disabled={selectedLeave?.color}
          >
            Delete
          </Button>
        )}
      </div>
    </Popover>
  );
};

export default AppDatePicker;
