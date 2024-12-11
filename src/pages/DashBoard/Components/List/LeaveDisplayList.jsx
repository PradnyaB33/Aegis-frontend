import { Info } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { format } from "date-fns";
import moment from "moment";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";

const LeaveDisplayList = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const GetLastLeaves = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/get-3-leaves-employee`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data.leaves;
  };

  const { data: previousLeaves } = useQuery(
    ["upcomingLeaves", authToken],
    GetLastLeaves
  );

  return (
    <article>
      <div className="bg-white shadow-sm rounded-md  w-full border">
        <div className=" flex w-full px-4 items-center justify-between">
          <div className="flex items-center gap-2 py-2  ">
            {/* <Avatar
              variant="rounded"
              className="!bg-sky-400 p-1 h-[30px] rounded-full"
            >
              <BeachAccessOutlined />
            </Avatar> */}
            <h1 className="text-lg  font-bold text-[#67748E]">
              Last Taken Leaves
            </h1>
          </div>
          {/* <button className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500">
            View All
          </button> */}
        </div>
        {/* <Divider variant="fullWidth" orientation="horizontal" /> */}

        {previousLeaves?.length <= 0 ? (
          <div className="px-5 py-2 ">
            <div className="space-x-2 items-center text-red-600  flex">
              <Info className="text-xl text-red-600" />
              <h1 className="text-lg  font-bold">No leaves found </h1>
            </div>
          </div>
        ) : (
          previousLeaves?.map((item, id) => (
            <div key={id}>
              <div className="p-4">
                <div className="flex gap-4 w-full items-center">
                  <h1 className="text-lg ">{item.title}</h1>
                  {/* <Chip
                    color={`${
                      item.status === "Approved"
                        ? "primary"
                        : item.status === "Pending"
                        ? "default"
                        : "error"
                    }`}
                    size="small"
                    variant="outlined"
                    label={item.status}
                  /> */}
                </div>
                <p className="text-md">
                  {format(new Date(item.start), "PP")}
                  {!moment(item?.end).isSame(item?.start) &&
                    `- ${format(new Date(item.end), "PP")}`}
                </p>
              </div>
              <Divider variant="fullWidth" orientation="horizontal" />
            </div>
          ))
        )}
      </div>
    </article>
  );
};

export default LeaveDisplayList;
