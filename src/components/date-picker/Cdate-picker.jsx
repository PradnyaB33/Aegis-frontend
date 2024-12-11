import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "@mui/icons-material";
import {
  Backdrop,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import { differenceInMinutes } from "date-fns";
import moment from "moment-timezone";
import React, { useContext, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../State/Function/Main";
import useGetUser from "../../hooks/Token/useUser";
import UserProfile from "../../hooks/UserData/useUser";
import usePublicHoliday from "../../pages/SetUpOrganization/PublicHolidayPage/usePublicHoliday";
import BasicButton from "../BasicButton";
import HeadingOneLineInfo from "../HeadingOneLineInfo/HeadingOneLineInfo";
import AuthInputFiled from "../InputFileds/AuthInputFiled";
import ReusableModal from "../Modal/component";
import MiniForm from "./components/mini-form";

const CAppDatePicker = ({
  data,
  handleUpdateFunction,
  selectEvent,
  setselectEvent,
  setNewAppliedLeaveEvents,
  selectedLeave,
  setSelectedLeave,
  newAppliedLeaveEvents,
  shiftData,
  deleteLeaveMutation,
  setIsCAppDatePickerVisible,
  calLoader,
  setCalLoader,
  setCalendarOpen,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  setIsLeaveTableModalOpen,
}) => {
  const localizer = momentLocalizer(moment);
  moment.tz.setDefault("Asia/Kolkata");
  const queryClient = useQueryClient();
  const { organisationId } = useParams();

  const [Delete, setDelete] = useState(false);
  const [update, setUpdate] = useState(false);
  const { handleAlert } = useContext(TestContext);
  const { authToken } = useGetUser();
  const [openDelete, setOpenDelete] = useState(false);
  const { filteredHolidayWithStartAndEnd, allPublicHoliday } =
    usePublicHoliday(organisationId);
  const [openJustificationModal, setOpenJustificationModal] = useState(null);
  const [justification, setJustification] = useState(false);

  const increaseEndDateByOneDay = (events) => {
    return events?.map((event) => ({
      ...event,
      end: moment(event.end).add(1, "days").toDate(),
    }));
  };

  const role = UserProfile().useGetCurrentRole();

  const leaves = increaseEndDateByOneDay(data?.currentYearLeaves);
  const newAppliedLeaveEvent = increaseEndDateByOneDay(newAppliedLeaveEvents);

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
    setJustification(event?.justification ? true : false);

    if (
      event.title === "present" ||
      event.title === "partial" ||
      event.title === "checkout not done"
    ) {
      console.log("clicked it", event);
      setOpenJustificationModal(event);
      setDelete(false);
      setUpdate(false);
      return;
    }

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

    // Check if the current day is in the data2 array
    const isDisabled = data2?.days?.days?.some((day) => {
      return day.day === dayOfWeek;
    });

    const isPublicHoliday = filteredHolidayWithStartAndEnd.some((holiday) =>
      moment(date).isSame(holiday.start, "day")
    );

    if (isDisabled || isPublicHoliday) {
      return {
        style: {
          pointerEvents: isDisabled ? "none" : "auto",
          backgroundColor: "#ffcccb", // light red
        },
      };
    }

    return {};
  };

  const handleSelectSlot = async ({ start, end }) => {
    setCalLoader(true);

    const selectedStartDate = moment(start).startOf("day");
    const selectedEndDate = moment(end).startOf("day").subtract(1, "days");

    const currentDate = moment(selectedStartDate);

    const includedDays = data2.days?.days?.map((day) => day.day);

    let extraDays = 0;
    let isExtraDay = false;

    while (currentDate.isSameOrBefore(selectedEndDate)) {
      const currentDay = currentDate.format("ddd");
      const isDisabled = includedDays.includes(currentDay);
      const isPublicHoliday = filteredHolidayWithStartAndEnd.some((holiday) =>
        moment(currentDate).isSame(holiday.start, "day")
      );

      if (isDisabled || isPublicHoliday) {
        setCalLoader(false);
        return handleAlert(
          true,
          "warning",
          "You cannot select holidays or public holidays"
        );
      }

      if (isDisabled || isPublicHoliday) {
        extraDays++;
        isExtraDay = true;
      }

      currentDate.add(1, "day");
    }

    await queryClient.invalidateQueries("employee-leave-table-without-default");

    const isOverlap = [
      ...data?.currentYearLeaves,
      ...newAppliedLeaveEvents,
      ...shiftData?.requests,
    ].some((range) => {
      const rangeStart = range.start;
      const rangeEnd = moment(range.end).startOf("day");

      const isStartBetween = selectedStartDate.isBetween(
        rangeStart,
        rangeEnd,
        undefined,
        "[)"
      );

      const isEndBetween = selectedEndDate.isBetween(
        rangeStart,
        rangeEnd,
        undefined,
        "(]"
      );

      const isOverlap =
        selectedStartDate.isSameOrBefore(rangeEnd) &&
        selectedEndDate.isSameOrAfter(rangeStart);

      const isSameOverlap = selectedStartDate.isSame(rangeStart);

      return isStartBetween || isEndBetween || isOverlap || isSameOverlap;
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
        title: isExtraDay
          ? "Extra Day"
          : selectEvent
          ? "Updated Leave"
          : "Selected Leave",
        start: new Date(start).toISOString(),
        end: new Date(selectedEndDate).toISOString(),
        color: selectEvent ? "black" : "blue",
        leaveTypeDetailsId: "",
        _id: selectEvent ? selectedLeave?._id : null,
        extraDays,
      };

      setNewAppliedLeaveEvents((prevEvents) => [...prevEvents, newLeave]);
      setSelectedLeave(null);
      setselectEvent(false);
    }
    setCalLoader(false);
  };

  const CustomToolbar = (toolbar) => {
    const handleMonthChange = (event) => {
      const newMonth = event.target.value;
      setSelectedMonth(newMonth + 1);
      const newDate = moment(toolbar.date).month(newMonth).toDate();
      toolbar.onNavigate("current", newDate); // Ensure "current" is used
    };

    const handleYearChange = (event) => {
      setCalLoader(true);
      const newYear = event.target.value;
      const newDate = moment(toolbar.date)
        .year(newYear)
        .month(selectedMonth - 1)
        .toDate(); // Set month to current month
      toolbar.onNavigate("current", newDate); // Ensure "current" is used
      setSelectedYear(newYear);
      setCalLoader(false);
    };

    return (
      <>
        <div className="pl-6 !m-0 flex md:flex-row flex-col justify-between gap-2 items-center">
          <div className="flex items-center py-3 justify-start">
            <HeadingOneLineInfo heading={"Attendance Calendar"} />
            <Select
              className="m-2 bg-white"
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
              className="m-2 bg-white"
              size="small"
              value={moment(toolbar.date).year()}
              onChange={handleYearChange}
            >
              {Array.from({ length: 10 }).map((_, index) => (
                <MenuItem
                  key={index}
                  value={moment(toolbar.date).year() + index}
                >
                  {moment(toolbar.date).year() + index}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="flex justify-end gap-1 items-center p-2">
            {update && (
              <BasicButton
                title={"Edit"}
                color={"success"}
                onClick={async () => {
                  await handleUpdateFunction();
                  setDelete(false);
                  setUpdate(false);
                }}
              />
            )}
            {Delete && (
              <BasicButton
                color={"danger"}
                title={"Delete"}
                onClick={handleDelete}
              />
            )}
            <BasicButton
              title={"Apply"}
              disabled={calLoader || newAppliedLeaveEvent?.length === 0}
              onClick={() => {
                setCalLoader(false);
                if (newAppliedLeaveEvents?.length > 0) {
                  setIsCAppDatePickerVisible(false);
                }
                setDelete(false);
                setUpdate(false);
                setCalendarOpen(false);
              }}
            />
          </div>
        </div>
        <div className="md:hidden flex justify-end p-2">
          <BasicButton
            title={"View Leave Table"}
            onClick={() => setIsLeaveTableModalOpen(true)}
          />
        </div>
      </>
    );
  };

  const handleDelete = (e) => {
    if (selectedLeave.title === "Selected Leave") {
      setNewAppliedLeaveEvents((prev) =>
        prev.filter((data) => {
          return (
            data.title !== selectedLeave.title &&
            data.start !== selectedLeave.start &&
            data.end !== selectedLeave.end
          );
        })
      );
    } else {
      setOpenDelete(true);
    }
    setDelete(false);
    setUpdate(false);
  };

  useEffect(() => {
    return () => {
      // document.removeEventListener("click", handleClickAway);
    };
  }, []);

  const eventPropGetter = (event) => {
    let backgroundColor = "blue";
    let color = "white";

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

    const matchingLeave = leaves?.find(
      (leave) => leave.leaveTypeDetailsId === event.leaveTypeDetailsId
    );

    if (matchingLeave) {
      backgroundColor = matchingLeave.color;
    }

    const dayOfWeek = moment(event.start).format("ddd");
    const isDisabled = data2?.days?.days?.some((day) => day.day === dayOfWeek);
    const isPublicHoliday = filteredHolidayWithStartAndEnd.some((holiday) =>
      moment(event.start).isSame(holiday.start, "day")
    );

    if (isDisabled || (isPublicHoliday && !event?.status)) {
      if (event.title === "Available") {
        backgroundColor = event?.color;
      } else {
        backgroundColor = "#ffcccb"; // light red
      }
    }

    return {
      style: {
        backgroundColor,
        color,
        fontWeight: event.isPublicHoliday ? "bold" : "normal",
      },
    };
  };

  const CustomEvent = ({ event }) => {
    const eventStyle = {
      height: "2em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "100px",
    };

    if (event.isPublicHoliday) {
      return (
        <span className="absolute text-[red] top-[1px]" style={eventStyle}>
          {event.title}
        </span>
      );
    }
    return <span style={eventStyle}>{event.title}</span>;
  };

  const DateCellContent = ({ label, date }) => {
    const isPublicHoliday = filteredHolidayWithStartAndEnd.some((holiday) =>
      moment(date).isSame(holiday.start, "day")
    );

    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
    const isDisabled = data2?.days?.days?.some((day) => day.day === dayOfWeek);

    return (
      <div
        style={{
          color: isPublicHoliday || isDisabled ? "red" : "grey",
          fontSize: "1.2em",
          fontWeight: "bold",
        }}
      >
        {label}
      </div>
    );
  };

  const JustificationSchema = z.object({
    message: z.string().min(5, { message: "Minimum 5 characters" }),
  });

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(JustificationSchema),
    defaultValues: {
      message: openJustificationModal?.justification ?? undefined,
    },
  });

  const addJustificationMutation = useMutation(
    (data) =>
      axios.put(
        `${process.env.REACT_APP_API}/route/leave/addJustification/${openJustificationModal._id}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("justifications");
        await queryClient.invalidateQueries(
          "employee-leave-table-without-default"
        );
        await queryClient.invalidateQueries("employee-leave-table");
        handleAlert(true, "success", "Justification added successfully.");
        reset();
        setOpenJustificationModal(null);
      },
      onError: (err) => {
        handleAlert(true, "error", err?.response?.data?.error);
      },
    }
  );

  const onSubmit = (data) => {
    addJustificationMutation.mutate(data);
    setCalLoader(false);
  };

  return (
    <div className="relative">
      {calLoader && (
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center z-50 bg-opacity-50 bg-gray-800">
          <Backdrop style={{ position: "absolute" }} open={true}>
            <CircularProgress />
          </Backdrop>
        </div>
      )}
      <div className="z-10">
        <div className="w-full">
          {allPublicHoliday &&
            filteredHolidayWithStartAndEnd &&
            shiftData?.requests &&
            data?.currentYearLeaves && (
              <Calendar
                localizer={localizer}
                views={["month"]}
                components={{
                  event: CustomEvent,
                  toolbar: CustomToolbar,
                  dateHeader: DateCellContent,
                }}
                events={
                  data
                    ? [
                        ...leaves,
                        ...shiftData?.requests,
                        ...newAppliedLeaveEvent,
                        ...filteredHolidayWithStartAndEnd.map((holiday) => ({
                          ...holiday,
                          isPublicHoliday: true,
                        })),
                      ]
                    : [
                        ...newAppliedLeaveEvent,
                        ...filteredHolidayWithStartAndEnd.map((holiday) => ({
                          ...holiday,
                          isPublicHoliday: true,
                        })),
                      ]
                }
                startAccessor="start"
                endAccessor="end"
                style={{
                  height: "400px",
                  width: "100%",
                }}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                datePropGetter={selectedLeave}
                eventPropGetter={eventPropGetter}
                titleAccessor={(event) =>
                  event.isPublicHoliday ? event.title : event.title
                }
                dayPropGetter={dayPropGetter}
                className="rbc-calendar" // Add this class to ensure proper alignment
              />
            )}
        </div>
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

      <ReusableModal
        open={openJustificationModal !== null}
        onClose={() => {
          setOpenJustificationModal(null);
          reset();
          setCalLoader(false);
        }}
        heading={"Attendance Status"}
      >
        {openJustificationModal && (
          <>
            <div className="space-y-2 my-2">
              <div className="flex gap-3 items-center">
                <h1 className="text-xl font-bold tracking-tighter text-gray-500">
                  {openJustificationModal.title === "present"
                    ? "Present"
                    : openJustificationModal.title}
                </h1>

                {openJustificationModal?.title !== "present" && (
                  <Chip
                    size="small"
                    color={
                      openJustificationModal?.status === "Rejected"
                        ? "error"
                        : openJustificationModal?.status === "Approved"
                        ? "success"
                        : "warning"
                    }
                    label={
                      !openJustificationModal?.justification
                        ? "Justification Required"
                        : openJustificationModal?.status
                    }
                  />
                )}
              </div>

              {openJustificationModal?.title !== "present" &&
                !openJustificationModal?.justification && (
                  <h1 className="text-red-500">
                    Note* : If justification is not provided, it will be
                    considered as leave
                  </h1>
                )}
              <div className="flex gap-2 items-center">
                <div className="flex gap-1 py-1 px-4 rounded-lg bg-gray-50 border">
                  <h1>Punch In Time:</h1>{" "}
                  <p>
                    {moment(openJustificationModal?.punchInTime)
                      .tz("Asia/Kolkata")
                      .format("hh:mm a")}
                  </p>
                </div>
                <div className="flex gap-1 py-1 px-4 rounded-lg bg-gray-50 border">
                  <h1>Punch Out Time:</h1>{" "}
                  <p>
                    {openJustificationModal.punchOutTime
                      ? moment(openJustificationModal?.punchOutTime)
                          .tz("Asia/Kolkata")
                          .format("hh:mm a")
                      : "Checkout not done"}
                  </p>
                </div>
              </div>

              {openJustificationModal.punchOutTime && (
                <div className="flex gap-1 w-max py-1 px-4 rounded-lg bg-gray-50 border">
                  <h1>Available Time:</h1>{" "}
                  {Math.floor(
                    differenceInMinutes(
                      new Date(openJustificationModal.punchOutTime),
                      new Date(openJustificationModal.punchInTime)
                    ) / 60
                  )}{" "}
                  hours{" "}
                  <p>
                    {differenceInMinutes(
                      new Date(openJustificationModal.punchOutTime),
                      new Date(openJustificationModal.punchInTime)
                    ) % 60}{" "}
                    minutes
                  </p>
                </div>
              )}
            </div>

            {openJustificationModal?.justification && justification && (
              <div className="flex justify-between items-center gap-1 py-1 px-4 rounded-lg bg-gray-50 border">
                <div className="flex gap-1">
                  <h1>Justification:</h1>{" "}
                  <p>{openJustificationModal?.justification}</p>
                </div>
                {role === "Employee" && (
                  <IconButton
                    onClick={() => {
                      setValue(
                        "message",
                        openJustificationModal?.justification
                      );
                      setJustification(false);
                    }}
                  >
                    <Edit color="primary" />
                  </IconButton>
                )}
              </div>
            )}

            {openJustificationModal?.message &&
              openJustificationModal?.status === "Approved" && (
                <div className="flex mt-2 justify-between items-center gap-1 py-1 px-4 rounded-lg bg-gray-50 border">
                  <div className="flex gap-1">
                    <h1>Manager Message:</h1>{" "}
                    <p>{openJustificationModal?.message}</p>
                  </div>
                </div>
              )}
            {role === "Employee" &&
              openJustificationModal.title !== "present" &&
              !justification && (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full space-y-4"
                >
                  <AuthInputFiled
                    name="message"
                    control={control}
                    type="textarea"
                    placeholder="Add justification here"
                    label="Justification"
                    errors={errors}
                    error={errors.message}
                  />
                  <div className="flex justify-end gap-2">
                    <BasicButton
                      title={"Cancel"}
                      color={"error"}
                      variant="outlined"
                      onClick={() => {
                        setOpenJustificationModal(null);
                        setCalLoader(false);
                        reset();
                      }}
                      type="button"
                    />
                    <BasicButton
                      disabled={addJustificationMutation?.isLoading}
                      title={"Submit"}
                      type="submit"
                    />
                  </div>
                </form>
              )}
          </>
        )}
      </ReusableModal>
    </div>
  );
};

export default CAppDatePicker;
