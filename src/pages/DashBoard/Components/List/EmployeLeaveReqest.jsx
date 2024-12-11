
import { Info } from "@mui/icons-material";
import { Avatar, Card } from "@mui/material";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { format } from "date-fns";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { UseContext } from "../../../../State/UseState/UseContext";

const EmployeeLeaveRequest = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const { data: EmployeeLeavesRequest } = useQuery(
    "employeeleaves",
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/leave/get`,
          {
            headers: { Authorization: authToken },
          }
        );
        return response.data.leaveRequests;
      } catch (err) {
        throw err;
      }
    }
  );

  return (
    <div>
      <div className="flex w-full  justify-between mb-2">
        <h1
          className="text-xl font-bold text-gray-800"
        >
          Employee Leave Request
        </h1>
        <Link
          to={"/notification"}
          className="flex group justify-center gap-2 items-center rounded-md h-max px-4 py-1 text-sm font-semibold text-white bg-[#1414fe]"
        >
          View All
        </Link>
      </div>

      <div>
        <Card elevation={3} >
          <div
            className="bg-[white] rounded-md w-full shadow-md"
          >

            <Divider variant="fullWidth" orientation="horizontal" />
            {EmployeeLeavesRequest?.length > 0 ? (
              EmployeeLeavesRequest?.slice(0, 3)?.map((item, id) => (
                <div
                  className="p-4"
                  key={id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: id * 0.2 }}
                >
                  <div className="gap-3 flex">
                    <Avatar variant="circle" />
                    <div>
                      <div className="flex items-center gap-3">
                        <h1 className="text-lg tracking-tight">
                          {item?.employeeId?.first_name}{" "}
                          {item?.employeeId?.last_name}
                        </h1>
                        <h1 className={`font-bold text-sm text-[#67748E]`}>
                          {item.title}
                        </h1>
                      </div>
                      <p className="text-md">
                        {format(new Date(item?.start), "PP")} -{" "}
                        {format(new Date(item?.end), "PP")}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="!text-2xl" />
                  <h1 className="text-xl font-semibold">No record found</h1>
                </article>
                <p>Currently no leave request is pending</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeLeaveRequest;
