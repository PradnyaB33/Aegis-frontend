import { Close } from "@mui/icons-material";
import {
  Backdrop,
  Button,
  CircularProgress,
  MenuItem,
  Popover,
  Select,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import useGetUser from "../../hooks/Token/useUser";
import usePublicHoliday from "../../pages/SetUpOrganization/PublicHolidayPage/usePublicHoliday";
import ReusableModal from "../Modal/component";
import MiniForm from "./components/mini-form";

const AppDatePicker = ({
  data,
  handleUpdateFunction,
  selectEvent,
  setselectEvent,
  setCalendarOpen,
  setNewAppliedLeaveEvents,
  selectedLeave,
  setSelectedLeave,
  newAppliedLeaveEvents,
  isCalendarOpen,
  shiftData,
  deleteLeaveMutation,
  calLoader,
  setCalLoader,
}) => {
  const localizer = momentLocalizer(moment);
  const queryClient = useQueryClient();
  const { organisationId } = useParams();
  const [Delete, setDelete] = useState(false);
  const [update, setUpdate] = useState(false);
  const { handleAlert } = useContext(TestContext);
  const { authToken } = useGetUser();
  const [openDelete, setOpenDelete] = useState(false);
  const { filteredHolidayWithStartAndEnd, allPublicHoliday } =
    usePublicHoliday(organisationId);

  const currentMonth = moment().month();
  const currentYear = moment().year();
  console.log("current month", currentMonth);
  console.log("currentYear ", currentYear);

  const { data: data2 } = useQuery(
    "employee-disable-weekends",
    async () => {
      setCalLoader(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/weekend/get`,
        {
          headers: { Authorization: authToken },
        }
      );

      return response.data;
    },
    {
      onSuccess: () => {
        setCalLoader(false);
      },
      onError: () => {
        setCalLoader(false);
      },
    }
  );
  const handleSelectEvent = (event) => {
    setCalLoader(true);
    setSelectedLeave(event);
    setCalendarOpen(true);
    if (event.title === "Selected Leave") {
      setDelete(true);
      setUpdate(false);
    } else if (event.color) {
      setUpdate(true);
      setDelete(true);
    } else {
      setDelete(false);
      setUpdate(false);
    }
    setCalLoader(false);
  };

  const dayPropGetter = (date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });

    // Check if the current day is in the data? array
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

  const makeMessage = useMemo(() => {
    if (selectedLeave?.status === "Approved") {
      return "Your leave has been approved";
    } else if (selectedLeave?.status === "Pending") {
      return "Your leave is pending for approval";
    } else if (selectedLeave?.status === "Rejected") {
      return "Your leave has been rejected";
    } else {
      return "";
    }
  }, [selectedLeave]);

  const handleSelectSlot = async ({ start, end }) => {
    setCalLoader(true);
    const selectedStartDate = moment(start).startOf("day");
    const selectedEndDate = moment(end).startOf("day").subtract(1, "days");

    const currentDate = moment(selectedStartDate);

    const includedDays = data2.days?.days?.map((day) => day.day);

    while (currentDate.isSameOrBefore(selectedEndDate)) {
      const currentDay = currentDate.format("ddd");
      if (includedDays.includes(currentDay)) {
        setCalLoader(false);
        return handleAlert(
          true,
          "warning",
          `You cannot select ${currentDay} for leave`
        );
      }
      currentDate.add(1, "day");
    }

    await queryClient.invalidateQueries("employee-leave-table-without-default");

    const isOverlap = [
      ...data?.currentYearLeaves,
      ...newAppliedLeaveEvents,
      ...shiftData?.requests,
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
      setCalLoader(false);
      return handleAlert(
        true,
        "warning",
        "You have already selected this leave"
      );
    } else {
      const newLeave = {
        title: selectEvent ? "Updated Leave" : "Selected Leave",
        start: new Date(selectedStartDate).toISOString(),
        end: new Date(selectedEndDate).toISOString(),
        color: selectEvent ? "black" : "blue",
        leaveTypeDetailsId: "",
        _id: selectedLeave?._id ? selectedLeave?._id : null,
      };

      setNewAppliedLeaveEvents((prevEvents) => [...prevEvents, newLeave]);
      setSelectedLeave(selectEvent ? null : newLeave);
      setselectEvent(false);
    }
    setCalLoader(false);
  };

  const CustomToolbar = (toolbar) => {
    const handleMonthChange = (event) => {
      const newDate = moment(toolbar.date).month(event.target.value).toDate();
      toolbar.onNavigate("current", newDate);
    };

    const handleYearChange = (event) => {
      setCalLoader(true);
      const newDate = moment(toolbar.date).year(event.target.value).toDate();
      toolbar.onNavigate("current", newDate);
      setCalLoader(false);
    };

    return (
      <>
        <div className="flex-row-reverse flex gap-4 items-center">
          <Button
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
          {" "}
          {selectedLeave && makeMessage}{" "}
        </div>
      </>
    );
  };
  const handleClickAway = (event) => {
    // const clickableElements = document.querySelectorAll(`.rbc-event-content`);
    // if (
    //   !Array.from(clickableElements).some((element) =>
    //     element.contains(event.target)
    //   )
    // ) {
    // } else {
    // }
  };
  const handleDelete = (e) => {
    if (selectedLeave.title === "Selected Leave") {
      setNewAppliedLeaveEvents((prev) =>
        prev.filter((data) => {
          // Check if the current leave matches the leave to be removed
          return !(
            data.title === selectedLeave.title &&
            data.start === selectedLeave.start &&
            data.end === selectedLeave.end
          );
        })
      );
    } else {
      setOpenDelete(true);
    }
    setDelete(false);
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
          "w-full xl:w-[400px] xl:h-[470px] !bottom-0 !p-0 flex flex-col justify-between !top-auto relative",
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
      {calLoader && (
        <div className="absolute h-[-webkit-fill-available] w-[-webkit-fill-available] flex items-center justify-center z-50">
          <Backdrop style={{ position: "absolute" }} open={true}>
            <CircularProgress />
          </Backdrop>
        </div>
      )}
      <div className=" bg-white z-10 ">
        <div className="w-full">
          {allPublicHoliday &&
            filteredHolidayWithStartAndEnd &&
            shiftData?.requests &&
            data?.currentYearLeaves && (
              <Calendar
                localizer={localizer}
                views={["month"]}
                components={{
                  toolbar: CustomToolbar,
                }}
                events={
                  data
                    ? [
                        ...data?.currentYearLeaves,
                        ...shiftData?.requests,
                        ...newAppliedLeaveEvents,
                        ...filteredHolidayWithStartAndEnd,
                        ...allPublicHoliday,
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
                onSelectEvent={handleSelectEvent}
                datePropGetter={selectedLeave}
                eventPropGetter={(event) => {
                  let backgroundColor = "blue";

                  if (event?.status) {
                    switch (event.status) {
                      case "Pending":
                        backgroundColor = "orange";
                        break;
                      case "Rejected":
                        backgroundColor = "red";
                        break;
                      case "Approved":
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
                dayPropGetter={dayPropGetter}
              />
            )}
        </div>
      </div>

      <div className="!px-4 !py-2 bg-white flex justify-between">
        <Button variant="contained" onClick={() => setCalendarOpen(false)}>
          Submit
        </Button>
        <Button
          variant="contained"
          onClick={handleDelete}
          className="rbc-event-content"
          disabled={!Delete}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            await handleUpdateFunction();
            setDelete(false);
            setUpdate(false);
          }}
          className="rbc-event-content"
          disabled={!update}
        >
          Update
        </Button>
      </div>

      <ReusableModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        heading={"Are you sure want delete ?"}
      >
        <MiniForm
          id={selectedLeave?._id}
          mutate={deleteLeaveMutation?.mutate}
          onClose={() => setOpenDelete(false)}
        />
      </ReusableModal>
    </Popover>
  );
};

export default AppDatePicker;

// // resizing >>reffer height and width
// import { Close } from "@mui/icons-material";
// import {
//   Backdrop,
//   Button,
//   CircularProgress,
//   MenuItem,
//   Popover,
//   Select,
// } from "@mui/material";
// import axios from "axios";
// import moment from "moment";
// import React, { useContext, useEffect, useMemo, useState ,useCallback } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import { useQuery, useQueryClient } from "react-query";
// import { useParams } from "react-router-dom";
// import { TestContext } from "../../State/Function/Main";
// import useGetUser from "../../hooks/Token/useUser";
// import usePublicHoliday from "../../pages/SetUpOrganization/PublicHolidayPage/usePublicHoliday";
// import ReusableModal from "../Modal/component";
// import MiniForm from "./components/mini-form";

// const AppDatePicker = ({
//   data,
//   handleUpdateFunction,
//   selectEvent,
//   setselectEvent,
//   setCalendarOpen,
//   setNewAppliedLeaveEvents,
//   selectedLeave,
//   setSelectedLeave,
//   newAppliedLeaveEvents,
//   isCalendarOpen,
//   shiftData,
//   deleteLeaveMutation,
//   calLoader,
//   setCalLoader,
// }) => {
//   const localizer = momentLocalizer(moment);
//   const queryClient = useQueryClient();
//   const { organisationId } = useParams();
//   const [Delete, setDelete] = useState(false);
//   const [update, setUpdate] = useState(false);
//   const { handleAlert } = useContext(TestContext);
//   const { authToken } = useGetUser();
//   const [openDelete, setOpenDelete] = useState(false);
//   const { filteredHolidayWithStartAndEnd, allPublicHoliday } =
//     usePublicHoliday(organisationId);

//   const [resizing, setResizing] = useState(false); // State for resizing
//   const [size, setSize] = useState({ width: 400, height: 470 }); // Initial size
//   const [startX, setStartX] = useState(0); // Initial X coordinate for resizing
//   const [startY, setStartY] = useState(0); // Initial Y coordinate for resizing

//   const currentMonth = moment().month();
//   const currentYear = moment().year();
//   console.log("current month", currentMonth);
//   console.log("currentYear ", currentYear);

//   const { data: data2 } = useQuery(
//     "employee-disable-weekends",
//     async () => {
//       setCalLoader(true);
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/weekend/get`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );

//       return response.data;
//     },
//     {
//       onSuccess: () => {
//         setCalLoader(false);
//       },
//       onError: () => {
//         setCalLoader(false);
//       },
//     }
//   );

//   const handleSelectEvent = (event) => {
//     setCalLoader(true);
//     setSelectedLeave(event);
//     setCalendarOpen(true);
//     if (event.title === "Selected Leave") {
//       setDelete(true);
//       setUpdate(false);
//     } else if (event.color) {
//       setUpdate(true);
//       setDelete(true);
//     } else {
//       setDelete(false);
//       setUpdate(false);
//     }
//     setCalLoader(false);
//   };

//   const dayPropGetter = (date) => {
//     const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });

//     const isDisabled = data2?.days?.days?.some((day) => {
//       return day.day === dayOfWeek;
//     });
//     if (isDisabled) {
//       return {
//         style: {
//           pointerEvents: "none",
//           backgroundColor: "#f7bfbf",
//         },
//       };
//     }

//     return {};
//   };

//   const makeMessage = useMemo(() => {
//     if (selectedLeave?.status === "Approved") {
//       return "Your leave has been approved";
//     } else if (selectedLeave?.status === "Pending") {
//       return "Your leave is pending for approval";
//     } else if (selectedLeave?.status === "Rejected") {
//       return "Your leave has been rejected";
//     } else {
//       return "";
//     }
//   }, [selectedLeave]);

//   const handleSelectSlot = async ({ start, end }) => {
//     setCalLoader(true);
//     const selectedStartDate = moment(start).startOf("day");
//     const selectedEndDate = moment(end).startOf("day").subtract(1, "days");

//     const currentDate = moment(selectedStartDate);

//     const includedDays = data2.days?.days?.map((day) => day.day);

//     while (currentDate.isSameOrBefore(selectedEndDate)) {
//       const currentDay = currentDate.format("ddd");
//       if (includedDays.includes(currentDay)) {
//         setCalLoader(false);
//         return handleAlert(
//           true,
//           "warning",
//           `You cannot select ${currentDay} for leave`
//         );
//       }
//       currentDate.add(1, "day");
//     }
//     await queryClient.invalidateQueries("employee-leave-table-without-default");

//     const isOverlap = [
//       ...data?.currentYearLeaves,
//       ...newAppliedLeaveEvents,
//       ...shiftData?.requests,
//     ].some((range) => {
//       const rangeStart = range.start;
//       const rangeEnd = moment(range.end).startOf("day").subtract(1, "days");

//       const isStartBetween = selectedStartDate.isBetween(
//         rangeStart,
//         rangeEnd,
//         undefined,
//         "[)"
//       );

//       const isEndBetween = selectedEndDate.isBetween(
//         rangeStart,
//         rangeEnd,
//         undefined,
//         "(]"
//       );

//       const isOverlap =
//         selectedStartDate.isSameOrBefore(rangeEnd) &&
//         selectedEndDate.isSameOrAfter(rangeStart);

//       return isStartBetween || isEndBetween || isOverlap;
//     });

//     if (isOverlap) {
//       setCalLoader(false);
//       return handleAlert(
//         true,
//         "warning",
//         "You have already selected this leave"
//       );
//     } else {
//       const newLeave = {
//         title: selectEvent ? "Updated Leave" : "Selected Leave",
//         start: new Date(start).toISOString(),
//         end: new Date(end).toISOString(),
//         color: selectEvent ? "black" : "blue",
//         leaveTypeDetailsId: "",
//         _id: selectedLeave?._id ? selectedLeave?._id : null,
//       };

//       setNewAppliedLeaveEvents((prevEvents) => [...prevEvents, newLeave]);
//       setSelectedLeave(selectEvent ? null : newLeave);
//       setselectEvent(false);
//     }
//     setCalLoader(false);
//   };

//   const CustomToolbar = (toolbar) => {
//     const handleMonthChange = (event) => {
//       const newDate = moment(toolbar.date).month(event.target.value).toDate();
//       toolbar.onNavigate("current", newDate);
//     };

//     const handleYearChange = (event) => {
//       setCalLoader(true);
//       const newDate = moment(toolbar.date).year(event.target.value).toDate();
//       toolbar.onNavigate("current", newDate);
//       setCalLoader(false);
//     };

//     return (
//       <>
//         <div className="flex-row-reverse flex gap-4 items-center">
//           <Button
//             color="error"
//             className="!h-full hover:!bg-[#da4f4f] hover:!text-white"
//             size="small"
//             onClick={() => setCalendarOpen(false)}
//           >
//             <Close />
//           </Button>
//           <Select
//             className="m-2"
//             size="small"
//             value={moment(toolbar.date).month()}
//             onChange={handleMonthChange}
//           >
//             {moment.months().map((month, index) => (
//               <MenuItem key={index} value={index}>
//                 {month}
//               </MenuItem>
//             ))}
//           </Select>
//           <Select
//             className="m-2"
//             size="small"
//             value={moment(toolbar.date).year()}
//             onChange={handleYearChange}
//           >
//             {Array.from({ length: 10 }).map((_, index) => (
//               <MenuItem key={index} value={moment(toolbar.date).year() + index}>
//                 {moment(toolbar.date).year() + index}
//               </MenuItem>
//             ))}
//           </Select>
//         </div>
//         <div className="flex w-full flex-row-reverse px-3 text-red-500 italic font-extrabold text-xs h-[20px]">
//           {" "}
//           {selectedLeave && makeMessage}{" "}
//         </div>
//       </>
//     );
//   };

//   const handleClickAway = (event) => {
//     const clickableElements = document.querySelectorAll(`.rbc-event-content`);

//     if (
//       !Array.from(clickableElements).some((element) =>
//         element.contains(event.target)
//       )
//     ) {
//     } else {
//     }
//   };

//   const handleDelete = (e) => {
//     if (selectedLeave.title === "Selected Leave") {
//       setNewAppliedLeaveEvents((prev) =>
//         prev.filter((data) => {
//           return !(
//             data.title === selectedLeave.title &&
//             data.start === selectedLeave.start &&
//             data.end === selectedLeave.end
//           );
//         })
//       );
//     } else {
//       setOpenDelete(true);
//     }
//     setDelete(false);
//   };

//   useEffect(() => {
//     document.addEventListener("click", handleClickAway);

//     return () => {
//       document.removeEventListener("click", handleClickAway);
//     };
//   }, []);

//   const handleMouseDown = (e) => {
//     setResizing(true);
//     setStartX(e.clientX);
//     setStartY(e.clientY);
//     e.preventDefault();
//   };

//   // const handleMouseMove = (e) => {
//   //   if (resizing) {
//   //     const newWidth = size.width + (e.clientX - startX);
//   //     const newHeight = size.height + (e.clientY - startY);
//   //     setSize({ width: newWidth, height: newHeight });
//   //     setStartX(e.clientX);
//   //     setStartY(e.clientY);
//   //   }
//   // };

//   // const handleMouseUp = () => {
//   //   setResizing(false);
//   // };
//   const handleMouseMove = useCallback((e) => {
//     if (resizing) {
//       const newWidth = size.width + (e.clientX - startX);
//       const newHeight = size.height + (e.clientY - startY);
//       setSize({ width: newWidth, height: newHeight });
//       setStartX(e.clientX);
//       setStartY(e.clientY);
//     }
//   }, [resizing, startX, startY, size]);

//   const handleMouseUp = useCallback(() => {
//     setResizing(false);
//   }, []);

//   // useEffect(() => {
//   //   if (resizing) {
//   //     document.addEventListener("mousemove", handleMouseMove);
//   //     document.addEventListener("mouseup", handleMouseUp);
//   //   } else {
//   //     document.removeEventListener("mousemove", handleMouseMove);
//   //     document.removeEventListener("mouseup", handleMouseUp);
//   //   }

//   //   return () => {
//   //     document.removeEventListener("mousemove", handleMouseMove);
//   //     document.removeEventListener("mouseup", handleMouseUp);
//   //   };
//   // }, [resizing, startX, startY, size]);

//   useEffect(() => {
//     if (resizing) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//     } else {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     }

//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [resizing, handleMouseMove, handleMouseUp]);

//   return (
//     <Popover
//       PaperProps={{
//         className:
//           "w-full xl:w-[400px] xl:h-[470px] !bottom-0 !p-0 flex flex-col justify-between !top-auto relative",
//         style: { width: `${size.width}px`, height: `${size.height}px` }, // Apply dynamic size
//       }}
//       open={isCalendarOpen}
//       onClose={() => setCalendarOpen(false)}
//       components={{
//         toolbar: CustomToolbar,
//       }}
//       anchorOrigin={{
//         vertical: "bottom",
//         horizontal: "right",
//       }}
//       style={{ height: "500px !important" }}
//     >
//       {calLoader && (
//         <div className="absolute h-[-webkit-fill-available] w-[-webkit-fill-available] flex items-center justify-center z-50">
//           <Backdrop style={{ position: "absolute" }} open={true}>
//             <CircularProgress />
//           </Backdrop>
//         </div>
//       )}
//       <div className=" bg-white z-10 ">
//         <div className="w-full">
//           {allPublicHoliday &&
//             filteredHolidayWithStartAndEnd &&
//             shiftData?.requests &&
//             data?.currentYearLeaves && (
//               <Calendar
//                 localizer={localizer}
//                 views={["month"]}
//                 components={{
//                   toolbar: CustomToolbar,
//                 }}
//                 events={
//                   data
//                     ? [
//                         ...data?.currentYearLeaves,
//                         ...shiftData?.requests,
//                         ...newAppliedLeaveEvents,
//                         ...filteredHolidayWithStartAndEnd,
//                         ...allPublicHoliday,
//                       ]
//                     : [...newAppliedLeaveEvents]
//                 }
//                 startAccessor="start"
//                 endAccessor="end"
//                 style={{
//                   height: "400px",
//                   width: "100%",
//                   background: "#fff",
//                 }}
//                 selectable
//                 onSelectSlot={handleSelectSlot}
//                 onSelectEvent={handleSelectEvent}
//                 datePropGetter={selectedLeave}
//                 eventPropGetter={(event) => {
//                   let backgroundColor = "blue";

//                   if (event?.status) {
//                     switch (event.status) {
//                       case "Pending":
//                         backgroundColor = "orange";
//                         break;
//                       case "Rejected":
//                         backgroundColor = "red";
//                         break;
//                       case "Approved":
//                         backgroundColor = "green";
//                         break;
//                       default:
//                         backgroundColor = "blue";
//                         break;
//                     }
//                   }
//                   if (event.color) {
//                     backgroundColor = event.color;
//                   }

//                   return {
//                     style: {
//                       backgroundColor,
//                     },
//                   };
//                 }}
//                 dayPropGetter={dayPropGetter}
//               />
//             )}
//         </div>
//       </div>

//       <div className="!px-4 !py-2 bg-white flex justify-between">
//         <Button variant="contained" onClick={() => setCalendarOpen(false)}>
//           Submit
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleDelete}
//           className="rbc-event-content"
//           disabled={!Delete}
//         >
//           Delete
//         </Button>
//         <Button
//           variant="contained"
//           onClick={async () => {
//             await handleUpdateFunction();
//             setDelete(false);
//             setUpdate(false);
//           }}
//           className="rbc-event-content"
//           disabled={!update}
//         >
//           Update
//         </Button>
//       </div>

//       <ReusableModal
//         open={openDelete}
//         onClose={() => setOpenDelete(false)}
//         heading={"Are you sure want delete ?"}
//       >
//         <MiniForm
//           id={selectedLeave?._id}
//           mutate={deleteLeaveMutation?.mutate}
//           onClose={() => setOpenDelete(false)}
//         />
//       </ReusableModal>

//       {/* Resizable handle */}
//       <div
//         onMouseDown={handleMouseDown}
//         style={{
//           width: '10px',
//           height: '10px',
//           backgroundColor: 'gray',
//           position: 'absolute',
//           bottom: 0,
//           right: 0,
//           cursor: 'nwse-resize',
//         }}
//       />
//     </Popover>
//   );
// };

// export default AppDatePicker;
