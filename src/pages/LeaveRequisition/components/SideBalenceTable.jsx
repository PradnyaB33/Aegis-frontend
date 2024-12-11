import { ArrowForwardIos } from "@mui/icons-material";
import { Chip, Tooltip } from "@mui/material";
import React from "react";
import useCustomStates from "../hooks/useCustomStates";

const SideBalenceTable = ({ leaveTableData }) => {
  const { setChangeTable, newAppliedLeaveEvents } = useCustomStates();
  return (
    <>
      <div className="md:block hidden w-full bg-white h-max rounded-md border ">
        <header className="bg-gray-200 flex justify-between  p-4  items-center">
          <h1 className="text-xl  text-gray-700  border-b-2 font-semibold  tracking-tight">
            Balence Leaves
          </h1>

          {newAppliedLeaveEvents.length > 0 && (
            <Tooltip title="Go Back to Leave Table">
              <ArrowForwardIos
                fontSize="small"
                className="cursor-pointer"
                color="primary"
                onClick={() => {
                  setChangeTable(false);
                }}
              />
            </Tooltip>
          )}
        </header>

        {leaveTableData?.leaveTypes?.map((item, id) => (
          <div key={id} className="border-b p-4  ">
            <div className="flex items-center gap-2">
              {/* <div
                style={{ background: item.color }}
                className={`h-3 w-3 rounded-full `}
              /> */}
              <div>
                <h1 className="text-lg text-gray-700   tracking-tight">
                  {item?.leaveName}
                </h1>
                <h1 className="text-xl">{item?.count}</h1>
              </div>
            </div>
          </div>
        ))}

        <div className="border-b p-4  ">
          <div className="flex items-center gap-2">
            <h1 className="text-xl text-gray-700 font-semibold  tracking-tight">
              Total
            </h1>
            <h1 className="text-xl text-gray-700 font-semibold   tracking-tight">
              {leaveTableData?.totalCoutn}
            </h1>
          </div>
        </div>
      </div>

      <div className="md:hidden flex gap-2 hor-scroll  overflow-auto w-full">
        {leaveTableData?.leaveTypes?.map((item, id) => (
          <>
            <Chip
              color="primary"
              className="my-2"
              label={`${item?.leaveName} ${item?.count} `}
            />
          </>
        ))}
      </div>
    </>
  );
};

export default SideBalenceTable;
