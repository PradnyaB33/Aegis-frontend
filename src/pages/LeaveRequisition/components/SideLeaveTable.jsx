import {
  ArrowBackIos,
  CalendarMonth,
  DeleteOutlined,
} from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { format } from "date-fns";
import moment from "moment";
import React, { useContext } from "react";
import Select from "react-select";
import useLeaveTable from "../../../hooks/Leave/useLeaveTable";
import { TestContext } from "../../../State/Function/Main";
import useCreateLeaveRequest from "../hooks/useCreateLeaveRequest";
import useCustomStates from "../hooks/useCustomStates";

const SideLeaveTable = ({ leaveTableData }) => {
  const {
    newAppliedLeaveEvents,
    updateLeaveEvent,
    removeNewAppliedLeaveEvents,
    setChangeTable,
    employee,
  } = useCustomStates();
  const { leaveMutation } = useCreateLeaveRequest(employee);
  const { handleAlert } = useContext(TestContext);
  const { withOutLeaves } = useLeaveTable();
  // const [selectedValues, setSelectedValues] = useState({});

  // const leaveCounts = []

  const getCurrentLeavesCount = leaveTableData?.leaveTypes?.map((item) => ({
    leaveName: item?.leaveName,
    count: item?.count,
  }));

  let newLeave = [];
  if (
    Array.isArray(leaveTableData?.leaveTypes) &&
    withOutLeaves?.LeaveTypedEdited
  ) {
    newLeave = [
      ...leaveTableData?.leaveTypes
        ?.filter((item) => item?.count > 0)
        ?.map((leave) => ({
          value: leave?._id,
          label: leave?.leaveName,
        })),
      ...withOutLeaves?.LeaveTypedEdited?.filter(
        (item) => item?.leaveName !== "Public Holiday" && item?.count < 0
      )?.map((leave) => ({
        value: leave?._id,
        label: leave?.leaveName,
      })),
    ];
  }

  const handleChange = (value, id) => {
    leaveTableData?.leaveTypes?.find(
      (item) => item?.leaveName === value?.label
    );

    const getSelectedLeaves = newAppliedLeaveEvents?.find(
      (_, index) => index === id
    );

    getCurrentLeavesCount?.map((item) => {
      if (value?.label === item?.leaveName) {
        const daysCount =
          moment(getSelectedLeaves?.end).diff(
            getSelectedLeaves?.start,
            "days"
          ) + 1;

        const newCount = moment(getSelectedLeaves?.start).isSame(
          getSelectedLeaves?.end
        )
          ? item?.count - 1
          : item?.count - daysCount;

        if (newCount <= 0) {
          console.log("this runs");
          handleAlert(
            true,
            "error",
            "You can't apply for more than available leaves"
          );
        } else {
          console.log("this runs one");
        }
      }
      updateLeaveEvent(id, value);
      return getCurrentLeavesCount;
    });
  };

  return (
    <>
      <div className=" min-h-[80vh] overflow-y-auto h-auto bg-white rounded-md border ">
        <header className="flex items-center gap-2 md:p-4 p-2 px-4 bg-gray-200">
          <Tooltip title="Go Back to Leave Table" className="md:!block !hidden">
            <ArrowBackIos
              fontSize="small"
              className="md:!block !hidden cursor-pointer"
              color="primary"
              onClick={() => {
                setChangeTable(true);
              }}
            />
          </Tooltip>
          <h1 className="md:text-xl text-lg  text-gray-700  border-b-2   font-semibold  tracking-tight">
            Selected Leaves
          </h1>
        </header>

        {newAppliedLeaveEvents?.map((item, id) => (
          <div key={id} className="border-b md:p-4 p-2 px-4">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-2">
                <h1 className="md:text-lg ">
                  {format(new Date(item?.start), "PP")}
                  {!moment(item.start).isSame(item.end) &&
                    " to " + format(new Date(item?.end), "PP")}
                </h1>

                <div
                  className={`flex rounded-md px-2 bg-white border-gray-200 border-[.5px] items-center`}
                >
                  <CalendarMonth className="text-gray-700 md:text-lg !text-[1em]" />
                  <Select
                    // value={selectedValues[item?.label] ?? null}
                    placeholder={"Select leave type"}
                    isClearable
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        borderWidth: "0px",
                        boxShadow: "none",
                      }),

                      menu: (styles) => ({
                        ...styles,
                        maxHeight: "250px",
                        overflowY: "auto",
                      }),
                      menuList: (styles) => ({
                        ...styles,
                        maxHeight: "250px", // Adjust the max maxHeght of the menu
                        overflowY: "auto",
                      }),
                    }}
                    className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    options={newLeave}
                    onChange={(leave) => {
                      handleChange(leave, id);
                    }}
                  />
                </div>
              </div>

              <IconButton onClick={() => removeNewAppliedLeaveEvents(id)}>
                <DeleteOutlined color="error" />
              </IconButton>
            </div>
          </div>
        ))}

        <div className="p-4 w-full flex justify-end ">
          <button
            type="button"
            onClick={() => leaveMutation.mutate()}
            className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-2 mr-4 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Apply for Leaves
          </button>
        </div>
      </div>
      {/* <div className="md:hidden block "></div> */}
    </>
  );
};

export default SideLeaveTable;
