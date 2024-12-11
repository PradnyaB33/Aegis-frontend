import { Delete, InfoOutlined } from "@mui/icons-material";
import {
  Alert,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { format } from "date-fns";
import moment from "moment";
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useParams } from "react-router-dom";
import ReusableModal from "../../../components/Modal/component";
import useLeaveRequesationHook from "../../../hooks/QueryHook/Leave-Requsation/hook";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
const localizer = momentLocalizer(moment);

const Mapped = ({
  item,
  index,
  subtractedLeaves,
  newAppliedLeaveEvents,
  setNewAppliedLeaveEvents,
  setCalendarOpen,
}) => {
  const { organisationId } = useParams();

  const { data: org } = useSubscriptionGet({
    organisationId: organisationId,
  });
  // to define the state, and import other function
  const { data, weekendDay, publicHoliday } = useLeaveRequesationHook();
  const [leavesTypes, setLeavesTypes] = useState(item?.leaveTypeDetailsId);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const removeItem = (idToRemove) => {
    const updatedAppliedLeaveEvents = newAppliedLeaveEvents.filter(
      (_, i) => i !== idToRemove
    );
    setNewAppliedLeaveEvents(updatedAppliedLeaveEvents);
  };

  let array = [];
  if (data?.leaveTypes) {
    array = [
      ...subtractedLeaves.filter((item) => item.count < 0),
      ...data?.leaveTypes.filter((item) => item.count > 0),
    ];
  }

  const handleChange = async (event) => {
    const selectedType = event.target.value;

    let isUnpaidLeave = array.find((item) => item._id === selectedType);
    if (
      isUnpaidLeave?.leaveName === "Comp Off" &&
      org?.organisation.isCompOff
    ) {
      setLeavesTypes(selectedType);
      newAppliedLeaveEvents[index].leaveTypeDetailsId = selectedType;
      setNewAppliedLeaveEvents(newAppliedLeaveEvents);
      setShowCalendarModal(true);
    } else {
      setLeavesTypes(selectedType);
      newAppliedLeaveEvents[index].leaveTypeDetailsId = selectedType;
      setNewAppliedLeaveEvents(newAppliedLeaveEvents);
    }
  };

  // get the weekend and public holiday and display in calendar
  const dayPropGetter = (date) => {
    const dayOfWeek = moment(date).format("ddd"); // Get the day as short form (e.g., 'Sat', 'Sun')

    // Check if the day is in the weekendDay array
    const isWeekend = weekendDay.some((weekend) => weekend.day === dayOfWeek);

    // Check if the date is a public holiday
    const isPublicHoliday = publicHoliday.some((holiday) =>
      moment(holiday.date).isSame(date, "day")
    );

    if (isWeekend) {
      return {
        style: {
          backgroundColor: "#ffcccc", // Light red background for weekends
          color: "#ffffff", // White text for contrast
        },
      };
    }

    if (isPublicHoliday) {
      return {
        style: {
          backgroundColor: "#ffeb3b", // Yellow background for public holidays
          color: "#000000", // Black text for contrast
        },
      };
    }

    return {};
  };
  // to check whether selected date is either public holiday or weekend
  const handleSelectSlot = (slotInfo) => {
    const selectedDate = slotInfo.start;

    const isWeekend = weekendDay.some(
      (weekend) => moment(selectedDate).format("ddd") === weekend.day
    );

    const isPublicHoliday = publicHoliday.some((holiday) =>
      moment(holiday.date).isSame(selectedDate, "day")
    );

    if (!org?.organisation.isCompOff) {
      setShowCalendarModal(false);
      return false;
    }
    if (!isWeekend && !isPublicHoliday && !org?.organisation.isCompOff) {
      // If the selected date is not a weekend or a public holiday, throw an error
      setErrorMessage(
        "Selected date is neither a holiday nor a weekend. Please contact HR."
      );
      setErrorOpen(true); // Open snackbar to show error
    } else {
      // Proceed to apply Comp Off leave
      const AvailableDay = array.find((item) => item.leaveName === "Available");
      setNewAppliedLeaveEvents((prevEvents) => [
        ...prevEvents,
        {
          title: AvailableDay?.leaveName,
          start: slotInfo.start,
          end: slotInfo.start,
          leaveTypeDetailsId: AvailableDay?._id,
          color: "blue", // Add your preferred color
          status: "Pending", // Set status to Pending
        },
      ]);

      setShowCalendarModal(false); // Close modal after selecting
    }
  };

  console.log(array);
  return (
    <div className=" py-1 md:flex-row flex-col   group flex gap-1 px-2 items-start  cursor-pointer">
      <div className="w-full gap-2 text-gray-700">
        <p className="text-lg truncate">
          {format(new Date(item?.start), "PP")}
          {!moment(item.start).isSame(item.end) &&
            " to " + format(new Date(item?.end), "PP")}
        </p>
      </div>
      <div className="flex  justify-between w-full items-start gap-2">
        {item?.title !== "Extra Day" ? (
          <FormControl sx={{ width: 180 }} size="small" fullWidth>
            <InputLabel id="demo-simple-select-label">Select Type</InputLabel>
            <Select
              required
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={leavesTypes}
              label="Select Type"
              disabled={
                item?.title === "Comp Off" || item?.title === "Extra Day"
              }
              onChange={handleChange}
            >
              {array
                ?.filter((ele) => {
                  if (!org?.organisation.isHalfDay) {
                    return ele?.leaveName !== "Half Day";
                  }
                  if (!org?.organisation.isCompOff) {
                    return ele?.leaveName !== "Comp Off";
                  } else {
                    return ele;
                  }
                })
                ?.map(
                  (item, index) =>
                    item.isActive &&
                    item && (
                      <MenuItem
                        selected={leavesTypes === item.leaveTypeDetailsId}
                        id={index}
                        key={index}
                        value={item._id}
                        disabled={
                          item.leaveName === "Available" &&
                          item.leaveName === "Comp Off"
                        } // Disable if Available is from Comp Off
                      >
                        <div className="flex justify-between w-full">
                          <div>{item.leaveName}</div>
                          {item.leaveName === "Comp Off" && (
                            <Tooltip
                              title="Compensatory leave is a leave granted as compensation for hours of overtime or for working on holidays or weekends"
                              arrow
                            >
                              <InfoOutlined className="text-gray-500 ml-2" />
                            </Tooltip>
                          )}
                        </div>
                      </MenuItem>
                    )
                )}
            </Select>
          </FormControl>
        ) : (
          <h1 className="text-lg text-gray-700">Extra Day</h1>
        )}
        <div className="flex gap-2 items-center">
          <IconButton
            className="!border-gray-300"
            onClick={() => removeItem(index)}
            variant="outlined"
          >
            <Delete className="text-red-500" />
          </IconButton>
        </div>
      </div>

      {/* Modal for selecting Comp Off date */}
      <ReusableModal
        heading={"Select Comp Off Date"}
        open={showCalendarModal}
        className="md:!w-[800px] !w-[90%] "
        onClose={() => setShowCalendarModal(false)}
      >
        <Calendar
          localizer={localizer}
          selectable
          defaultView="month"
          views={["month"]}
          style={{ height: 400, width: "100%" }}
          dayPropGetter={dayPropGetter} // Function to style weekends and holidays
          events={newAppliedLeaveEvents} // Pass the events here
          onSelectSlot={handleSelectSlot} // Use the handleSelectSlot function
        />
        <Button
          variant="outlined"
          onClick={() => setShowCalendarModal(false)}
          style={{ marginTop: "10px" }}
        >
          Close
        </Button>
      </ReusableModal>
      {/* Snackbar to show error messages */}
      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        onClose={() => setErrorOpen(false)}
      >
        <Alert onClose={() => setErrorOpen(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Mapped;
