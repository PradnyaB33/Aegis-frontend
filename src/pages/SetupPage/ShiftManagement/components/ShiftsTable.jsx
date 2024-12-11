import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { Popover, Skeleton } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
import SummaryTable from "./SummaryTable";

const ShiftsTable = () => {
  const { cookies } = useContext(UseContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const authToken = cookies["aegis"];
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);

  const { data, isLoading } = useQuery("table", async () => {
    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/shiftApply/get`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      const pendingArr = resp.data.requests.filter((item, idx) => {
        return item.status === "Pending";
      });

      const approvedArr = resp.data.requests.filter((item, idx) => {
        return item.status === "Approved";
      });
      const rejectedArr = resp.data.requests.filter((item, idx) => {
        return item.status === "Rejected";
      });
      setPending(pendingArr);
      setApproved(approvedArr);
      setRejected(rejectedArr);
      return resp.data.requests;
    } catch (error) {
      console.log(error.message);
    }
  });

  if (isLoading) {
    return (
      <div className="w-full h-[30vh]">
        <span className="font-semibold text-center text-2xl">Loading...</span>
        <Skeleton
          variant="rectangular"
          className="md:w-[350px] w-full md:h-[30vh] h-[25vh] rounded-lg border-2"
        />
      </div>
    );
  }

  console.log(data?.length);

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  return (
    <article className="md:w-[350px] w-full h-max shadow-lg rounded-lg border-2">
      <h1 className="text-xl py-6 px-6 font-semibold flex items-center gap-3 justify-between border-b-2">
        <AccountBalanceIcon className="text-gray-400" />
        <div className="">Summary of Shifts</div>
        <div className="pr-5"></div>
      </h1>
      <div className="w-full">
        <div>
          <div className="flex justify-between items-center py-6 px-6 border-b-2">
            <h1 className="text-md text-black font-bold tracking-wide">
              Applied
            </h1>
            <h1 className="text-lg tracking-wide font-bold text-black">
              {data?.length}
            </h1>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center py-6 px-6 border-b-2">
            <h1 className="text-md text-black font-bold tracking-wide">
              Approved
            </h1>
            <h1 className="text-lg tracking-wide font-bold text-black">
              {approved.length}
            </h1>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center py-6 px-6 border-b-2">
            <h1 className="text-md text-black font-bold tracking-wide">
              Pending For Approval
            </h1>
            <h1 className="text-lg tracking-wide font-bold text-black">
              {pending.length}
            </h1>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center py-6 px-6">
            <h1 className="text-md text-black font-bold tracking-wide">
              Rejected
            </h1>
            <h1 className="text-lg tracking-wide font-bold text-black">
              {rejected.length}
            </h1>
          </div>
        </div>
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <SummaryTable />
      </Popover>
    </article>
  );
};

export default ShiftsTable;
