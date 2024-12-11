import { Info, Search } from "@mui/icons-material";
import { Avatar, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import LeaveRejectmodal from "../../components/Modal/LeaveModal/LeaveRejectmodal";
import useLeaveNotificationHook from "../../hooks/QueryHook/notification/leave-notification/hook";
import useGetUser from "../../hooks/Token/useUser";

const LeaveAcceptModal = () => {
  const { authToken } = useGetUser();
  // const { employeeId } = useParams();
  const [employeeId, setEmployeeId] = useState();
  const { data } = useLeaveNotificationHook();

  const queryClient = useQueryClient();

  const {
    data: EmpNotification,
    isLoading: empDataLoading,
    isFetching,
  } = useQuery({
    queryKey: ["EmpDataLeave", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/leave/get/${employeeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: employeeId !== undefined,
  });

  // Mutation to update notification count
  const mutation = useMutation(
    ({ employeeId }) => {
      return axios.put(
        `${process.env.REACT_APP_API}/route/leave/update/notificationCount/${employeeId}`,
        { notificationCount: 0 },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        // Refetch the punch notifications after updating notification count
        queryClient.invalidateQueries("employee-leave");
      },
      onError: (error) => {
        console.error("Error updating notification count:", error);
      },
    }
  );

  const handleEmployeeClick = (employeeId) => {
    setEmployeeId(employeeId);
    mutation.mutate({ employeeId });
  };

  return (
    <div>
      <section className="min-h-[90vh] flex">
        <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
          <div className="p-2 my-2 !py-2  ">
            <div className="space-y-2">
              <div
                className={`
                  flex  rounded-md items-center px-2 outline-none border-gray-200 border-[.5px]  bg-white py-1 md:py-[6px]`}
              >
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type={"test"}
                  placeholder={"Search Employee"}
                  className={`border-none bg-white w-full outline-none px-2  `}
                />
              </div>
            </div>
          </div>
          {!isFetching &&
            data?.arrayOfEmployee?.map(
              (employee, idx) =>
                employee !== null && (
                  <Link
                    onClick={() => handleEmployeeClick(employee?._id)}
                    //to={`/leave-notification/${employee?._id}`}
                    className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 ${employee?._id === employeeId &&
                      "bg-blue-500 text-white hover:!bg-blue-300"
                      }`}
                    key={idx}
                  >
                    <Avatar />
                    <div>
                      <h1 className="md:text-[1.2rem] text-sm">
                        {employee?.first_name} {employee?.last_name}
                      </h1>
                      <h1
                        className={`md:text-sm text-xs text-gray-500 ${employee?._id === employeeId && "text-white"
                          }`}
                      >
                        {employee?.email}
                      </h1>
                    </div>
                  </Link>
                )
            )}
        </article>

        <article className="w-[75%] min-h-[90vh] border-l-[.5px]   ">
          <div className="px-4 pt-2">
            <HeadingOneLineInfo
              heading={"Attendance & Leave Requests"}
              info={
                "Here you will be able to approve or reject the attendance & leave notifications"
              }
            />
          </div>
          {empDataLoading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress />
            </div>
          ) : employeeId ? (
            EmpNotification?.length <= 0 ? (
              <div className="flex px-4 w-full items-center my-4">
                <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                  <Info /> No Leave Request Found
                </h1>
              </div>
            ) : (
              <>
                <div className="px-4">
                  {EmpNotification?.leaveRequests?.map((items, itemIndex) => (
                    <LeaveRejectmodal
                      key={itemIndex}
                      items={items}
                      idx={itemIndex}
                      length={EmpNotification?.leaveRequests?.length}
                      isFetching={isFetching}
                    />
                  ))}
                </div>
              </>
            )
          ) : (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="md:text-lg text-sm w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> Select employee to see their requests
              </h1>
            </div>
          )}
        </article>
      </section>
    </div>
  );
};
export default LeaveAcceptModal;
