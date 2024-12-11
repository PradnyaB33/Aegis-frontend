import { CalendarMonth, Delete } from "@mui/icons-material";
import {
  Badge,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import { differenceInDays, format, parseISO } from "date-fns";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
import UserProfile from "../../../../hooks/UserData/useUser";
import useShiftStore from "../store/useShiftStore";
const badgeStyle = {
  "& .MuiBadge-badge": {
    color: "#d1d5db",
    backgroundColor: "white",
    border: "2px solid #d1d5db",
    transition: "color 0.3s, background-color 0.3s, border-color 0.3s",
  },
};
const Mapped = ({
  item,
  index,
  newAppliedLeaveEvents,
  setNewAppliedLeaveEvents,
  isUpdatingShift,
}) => {
  const [leavesTypes, setLeavesTypes] = useState(item?.leaveTypeDetailsId);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { setShiftName } = useShiftStore();
  const { getCurrentUser } = UserProfile();
  const queryclient = useQueryClient();
  const user = getCurrentUser();
  const id = user.organizationId;

  const { data: extraDay } = useQuery("extra-day", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/get/extra-day`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.extraDay;
  });
  console.log("extra day", extraDay);

  const [sName, setSName] = useState([]);
  // get the shift from organization
  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get(
          `${process.env.REACT_APP_API}/route/shifts/${id}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        let shifts = resp?.data.shifts || [];

        // If extraDay is true, push "Extra Day" as a shift
        if (extraDay?.extraDay) {
          shifts.push({
            shiftName: "Extra Day",
            startTime: "N/A",
            endTime: "N/A",
            selectedDays: ["Extra Day"],
            organizationId: extraDay.organizationId,
            workingFrom: "office",
            _id: extraDay._id,
          });
        }

        // Update state with shifts
        setSName(shifts);

        queryclient.invalidateQueries("employee-leave-table-without-default");
      } catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line
  }, [extraDay]);

  console.log("sName", sName);

  // to define the function for select shift
  const handleChange = (event) => {
    const selectedShiftName = event.target.value;
    setLeavesTypes(selectedShiftName);

    setNewAppliedLeaveEvents((prevEvents) => {
      const updatedEvents = [...prevEvents];
      if (index >= 0 && index < updatedEvents.length) {
        updatedEvents[index] = {
          ...updatedEvents[index],
          name: selectedShiftName,
        };
      }
      return updatedEvents;
    });

    // Update the shift name in the store
    setShiftName(selectedShiftName);
  };

  console.log("Current newAppliedLeaveEvents", newAppliedLeaveEvents);
  const removeItem = (idToRemove) => {
    const updatedAppliedLeaveEvents = newAppliedLeaveEvents.filter(
      (_, i) => i !== idToRemove
    );
    setNewAppliedLeaveEvents(updatedAppliedLeaveEvents);
  };
  const handleChange2 = (name) => {
    setShiftName(name);
  };

  return (
    <div
      key={index}
      className={`border border-gray-200 flex-col lg:flex-row group  flex gap-4 lg:items-center justify-between items-start rounded-lg hover:bg-gray-100 border-b p-2 cursor-pointer ${
        isUpdatingShift ? "hidden" : "" // Conditionally hide the component
      }`}
    >
      <div className="flex items-cente gap-4 pt-4">
        <Badge
          slotProps={{
            badge: {
              className:
                "group-hover:bg-gray-50 group-hover:text-gray-600 group-hover:border-gray-600 ",
            },
          }}
          badgeContent={
            <span>
              {differenceInDays(parseISO(item.end), parseISO(item.start))} day
            </span>
          }
          sx={badgeStyle}
          color="primary"
          variant="standard"
        >
          <Button
            variant="text"
            size="large"
            className="!rounded-full !h-16 !w-16 group-hover:!text-gray-500 !text-gray-300 !border-[2px] !border-gray-300 group-hover:!border-gray-500 !border-solid"
            color="info"
          >
            <CalendarMonth className=" !text-4xl" />
          </Button>
        </Badge>

        <div className="inline-grid m-auto items-center gap-2 group-hover:text-gray-500 text-gray-300 font-bold">
          <p className="text-md truncate ">
            {differenceInDays(parseISO(item.end), parseISO(item.start)) !== 1
              ? `Selected dates from ${format(
                  new Date(item.start),
                  "do 'of' MMMM"
                )} to  ${moment(item.end)
                  .subtract(1, "days")
                  .format("Do of MMMM")}`
              : `Your selected date is ${format(
                  new Date(item.start),
                  "do 'of' MMMM"
                )}`}
          </p>
        </div>
      </div>
      <div className="flex lg:w-fit lg:justify-end justify-between w-full items-center gap-2">
        <FormControl sx={{ width: 180 }} size="small" fullWidth>
          <InputLabel id={`select-shift-type-${index}`}>
            Select Shift Type
          </InputLabel>
          <Select
            defaultValue={leavesTypes}
            required
            labelId={`select-shift-type-${index}`}
            id={`select-shift-${index}`}
            value={item.name}
            label="Select Shift Type"
            onChange={handleChange}
          >
            {sName?.map((item, index) => {
              console.log("items in side", item);
              return (
                <MenuItem
                  selected={leavesTypes === item.leaveTypeDetailsId}
                  id={index}
                  key={index}
                  value={item.shiftName}
                  onClick={() => handleChange2(item.shiftName)}
                >
                  <div className="flex justify-between w-full">
                    {!item && "No Shifts Available"}
                    <div>{item.shiftName} </div>
                  </div>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Button
          type="button"
          className="!border-gray-300 group-hover:!border-gray-400"
          onClick={() => removeItem(index)}
          variant="outlined"
        >
          <Delete className="text-gray-300 group-hover:text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default Mapped;
