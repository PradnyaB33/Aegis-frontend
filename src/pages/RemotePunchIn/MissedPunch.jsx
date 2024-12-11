import { CalendarMonth, West } from "@mui/icons-material";
import { Badge, Button, Skeleton } from "@mui/material";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";
import AppDatePicker from "../../components/date-picker/date-picker3";
import useShiftData from "../../hooks/MissedData/useMissedData";
import Mapped from "./components/mapped-form";
import ShiftsTable from './components/MissedTable'

const MissedPunch = () => {
  const {
    data,
    setCalendarOpen,
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
  console.log(selectedLeave);

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
              handleUpdateFunction={handleUpdateFunction}
              selectEvent={selectEvent}
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
                    {newAppliedLeaveEvents?.map((item, index) => (
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
                      />
                    ))}
                    <div className="w-full m-auto flex justify-center my-4">
                      <Button
                        type="submit"
                        variant="contained"
                        className="font-bold m-auto w-fit"
                        onClick={() => window.location.reload()}
                      >
                        Apply for shift
                      </Button>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              // Render if no shifts available
              <>
                <div className="w-full h-max grid justify-center relative gap-4 !mt-4 space-y-2 bg-white py-3 px-8 shadow-lg rounded-lg">
                  <Button
                    disabled={isLoading}
                    onClick={() => setCalendarOpen(true)}
                    variant="text"
                    size="large"
                    className="text-center w-fit !m-auto !capitalize !underline "
                  >
                    {!isLoading
                      ? "Apply for Shifts"
                      : "Wait Calendar is Loading"}
                  </Button>
                </div>
              </>
            )}
          </article>
        </div>
      </section>
    </>
  );
};

export default MissedPunch;
