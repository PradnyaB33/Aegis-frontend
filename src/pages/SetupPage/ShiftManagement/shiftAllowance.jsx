import { CalendarMonth, West } from "@mui/icons-material";
import { Badge, Button, Skeleton } from "@mui/material";
import axios from "axios"; // Import axios for making HTTP requests
import React, { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";
import { UseContext } from "../../../State/UseState/UseContext";
import AppDatePicker from "../../../components/date-picker/date-picker2";
import useShiftData from "../../../hooks/ShiftData/useShiftData";
import ShiftsTable from "./components/ShiftsTable";
import Mapped from "./components/mapped-form";

const ShiftAllowance = () => {
  const {
    data,
    leaveData,
    setCalendarOpen,
    newData,
    setNewData,
    isLoading,
    handleSubmit,
    handleInputChange,
    newAppliedLeaveEvents,
    setNewAppliedLeaveEvents,
    isCalendarOpen,
    handleUpdateFunction,
    selectEvent,
    setSelectedLeave,
    selectedLeave,
    setselectEvent,
    isUpdating,
    disabledShiftId,
  } = useShiftData();
  const { cookies } = useContext(UseContext);
  const { setAppAlert } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryclient = useQueryClient();
  const [shouldHideSelectedShift, setShouldHideSelectedShift] = useState(false);
  const [updateId, setUpdateId] = useState();
  const [selectedLeaveIndex, setSelectedLeaveIndex] = useState(null);

  console.log("newAppliedLeaveEvents", newAppliedLeaveEvents);


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
      queryclient.invalidateQueries("employee-leave-table-without-default");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUpdateClick = async () => {
    setSelectedLeaveIndex("number");
    setShouldHideSelectedShift(true);
    try {
      console.log("inside the update function", newAppliedLeaveEvents);
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/route/shiftApply/update/${updateId}`,
        {
          title: newAppliedLeaveEvents[0].name,
          start: newAppliedLeaveEvents[0].start,
          end: newAppliedLeaveEvents[0].end,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Shift Updated Successfully",
      });
      queryclient.invalidateQueries("employee-leave-table-without-default");
      getLatestShifts();
      queryclient.invalidateQueries("employee-leave-table");
      queryclient.invalidateQueries("employee-summary-table");
      setNewAppliedLeaveEvents([]);
      console.log("Shift updated:", response.data);
    } catch (error) {
      console.error("Error updating shift:", error);
    }
  };

  return (
    <>
      <section className="">
        <header className="text-xl pt-6 bg-gray-50 shadow-md  p-4">
          <Link to={"/"}>
            <West className="mx-4 !text-xl" />
          </Link>
          Shift Management
          <div>
            <p className="text-xs text-gray-600 pl-12">
              Select day and shift type to apply shift.
            </p>
          </div>
        </header>

        <div className="flex flex-col-reverse md:flex-row w-full justify-start p-6 gap-4">
          <div className="flex flex-col gap-4">
            <ShiftsTable />
          </div>
          <article className="md:w-[100%] space-y-2">
            {/* Calendar display */}
            {isLoading ? (
              <div className="space-y-2 mb-4 w-full h-max bg-white p-4 shadow-xl rounded-lg">
                <div className="flex items-center gap-8 px-2">
                  <Badge
                    badgeContent={"loading"}
                    color="primary"
                    variant="standard"
                  >
                    <Button
                      disabled
                      variant="contained"
                      size="large"
                      className="!rounded-full !h-16 !w-16 group-hover:!text-white !text-black"
                      color="info"
                    >
                      <CalendarMonth className="!text-4xl text-gr" />
                    </Button>
                  </Badge>
                  <div>
                    <Skeleton variant="text" width={160} height={20} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 mb-4 w-full h-max bg-white p-4 shadow-xl rounded-lg ">
                <div className="flex items-center gap-8 px-2">
                  <Badge badgeContent={"Click"} color="primary">
                    <Button
                      disabled={isLoading}
                      onClick={handleInputChange}
                      variant="contained"
                      size="large"
                      className="!rounded-full !h-16 !w-16 group-hover:!text-white !text-black"
                      color="info"
                    >
                      <CalendarMonth className=" !text-4xl" />
                    </Button>
                  </Badge>
                  <p className="!text-gray-400 font-semibold mb-2 text-xl">
                    Select Shifts
                  </p>
                </div>
              </div>
            )}

            {/* Date picker */}
            <AppDatePicker
              data={data}
              setNewData={setNewData}
              newData={newData}
              handleUpdateFunction={handleUpdateFunction}
              leaveData={leaveData}
              selectEvent={selectEvent}
              setUpdateId={setUpdateId}
              setselectEvent={setselectEvent}
              setCalendarOpen={setCalendarOpen}
              setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
              selectedLeave={selectedLeave}
              setSelectedLeave={setSelectedLeave}
              newAppliedLeaveEvents={newAppliedLeaveEvents}
              isCalendarOpen={isCalendarOpen}
              disabledShiftId={disabledShiftId}
            />

            {/* Shifts form */}
            {newAppliedLeaveEvents.length > 0 &&
              Array.isArray(newAppliedLeaveEvents) ? (
              <>
                <form
                  onSubmit={handleSubmit}
                  className="h-max !mt-4 space-y-2 bg-white py-3 px-8 shadow-lg rounded-lg"
                >
                  <h1 className="text-gray-400 font-semibold mb-4 text-md">
                    Your Shifts
                  </h1>
                  <div className="flex flex-col gap-4">
                    {/* Mapping through newAppliedLeaveEvents */}
                    {newAppliedLeaveEvents.map((item, index) => (
                      <Mapped
                        key={index}
                        setCalendarOpen={setCalendarOpen}
                        subtractedLeaves={data?.LeaveTypedEdited}
                        item={item}
                        index={index}
                        newAppliedLeaveEvents={newAppliedLeaveEvents}
                        setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
                        isUpdating={isUpdating} // Pass isUpdating to Mapped component
                        isDisabled={item._id === disabledShiftId} // Check if the current shift is disabled
                        shouldHide={
                          shouldHideSelectedShift &&
                          index === selectedLeaveIndex
                        } // Hide the selected shift
                      />
                    ))}
                  </div>
                  {/* Show Apply for Shift button if not updating */}
                  {newAppliedLeaveEvents[0].title === "Selected Shift" && (
                    <div className="w-full m-auto flex justify-center my-4">
                      <Button
                        type="submit"
                        variant="contained"
                        className="font-bold m-auto w-fit"
                      >
                        Apply for shift
                      </Button>
                    </div>
                  )}
                  {/* Show Update button if updating */}
                  {newAppliedLeaveEvents[0].title === "Updated Shift" && (
                    <div className="w-full m-auto flex justify-center my-4">
                      <Button
                        type="button"
                        variant="contained"
                        className="font-bold m-auto w-fit"
                        onClick={handleUpdateClick}
                      >
                        Update
                      </Button>
                    </div>
                  )}
                </form>
              </>
            ) : (
              // Render if no shifts available
              <>
                {!isUpdating && (
                  <div className="w-full m-auto flex justify-center my-4">
                    <Button
                      type="submit"
                      variant="contained"
                      onClick={() => setCalendarOpen(true)}
                      className="font-bold m-auto w-fit"
                    >
                      Apply for shift
                    </Button>
                  </div>
                )}
              </>
            )}
          </article>
        </div>
      </section>
    </>
  );
};

export default ShiftAllowance;
