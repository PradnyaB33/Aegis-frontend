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
import React, { useEffect, useState } from "react";
import useShiftStore from "../../SetupPage/ShiftManagement/store/useShiftStore";
const Mapped = ({
  item,
  index,
  // subtractedLeaves,
  newAppliedLeaveEvents,
  setNewAppliedLeaveEvents,
  setCalendarOpen,
}) => {
  const [leavesTypes, setLeavesTypes] = useState(item?.leaveTypeDetailsId);
  const { setShiftName } = useShiftStore();
  const badgeStyle = {
    "& .MuiBadge-badge": {
      color: "#d1d5db",
      backgroundColor: "white",
      border: "2px solid #d1d5db",
      transition: "color 0.3s, background-color 0.3s, border-color 0.3s",
    },
  };
  const [sName, setSName] = useState([]);

  // Fetch initial shift types
  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get(
          `${process.env.REACT_APP_API}/route/getAllShifts`
        );
        setSName(resp.data.shifts);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleChange = (event) => {
    const selectedShiftId = event.target.value;
    setLeavesTypes(selectedShiftId);
  };

  console.log(newAppliedLeaveEvents);
  const removeItem = (idToRemove) => {
    console.log("Removing item with id:", idToRemove);
    console.log("Current newAppliedLeaveEvents:", newAppliedLeaveEvents);

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
      className=" border border-gray-200 flex-col lg:flex-row group  flex gap-4 lg:items-center justify-between items-start rounded-lg hover:bg-gray-100 border-b p-2 cursor-pointer"
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
            {`Selected dates from ${format(
              new Date(item.start),
              "do 'of' MMMM"
            )} to  ${format(new Date(item.end), "do ' of' MMMM")}`}
            {``}
          </p>
        </div>
      </div>
      <div className="flex lg:w-fit lg:justify-end justify-between w-full items-center gap-2">
        <FormControl sx={{ width: 180 }} size="small" fullWidth>
          <InputLabel id="demo-simple-select-label">
            Select Shift Type
          </InputLabel>
          <Select
            defaultValue={leavesTypes}
            required
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={leavesTypes}
            label="Select Type"
            onChange={handleChange}
          >
            {sName?.map((item, index) => {
              return (
                <MenuItem
                  selected={leavesTypes === item.leaveTypeDetailsId}
                  id={index}
                  key={index}
                  value={item._id}
                  onClick={() => handleChange2(item.shiftName)}
                >
                  <div className="flex justify-between w-full">
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
