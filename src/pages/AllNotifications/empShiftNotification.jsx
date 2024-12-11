import { Info, West } from "@mui/icons-material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { Avatar, CircularProgress } from "@mui/material";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import usePunchNotification from "../../hooks/QueryHook/notification/punch-notification/hook";
import useAuthToken from "../../hooks/Token/useAuth";
import UserProfile from "../../hooks/UserData/useUser";
const EmpShiftNotification = () => {
  const authToken = useAuthToken();
  const { data } = usePunchNotification();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user._id;
  console.log("my data", data?.arrayOfEmployee);

  const { data: EmpNotification, isLoading: empDataLoading } = useQuery({
    queryKey: ["EmpDataPunchNotification", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/shiftApply/get`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        console.log("this is my data bro", res.data);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: employeeId !== undefined,
  });

  console.log("this is emp notification", EmpNotification);

  return (
    <div>
      <header className="text-xl w-full pt-6 border bg-white shadow-md p-4">
        <Link to={"/organisation/:organisationId/income-tax"}>
          <West className="mx-4 !text-xl" />
        </Link>
        Employee Shift Status
      </header>
      <section className="min-h-[90vh] flex  ">
        <article className="w-[100%] min-h-[90vh] border-l-[.5px]  bg-gray-50">
          {empDataLoading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress />
            </div>
          ) : employeeId ? (
            EmpNotification?.length <= 0 ? (
              <div className="flex px-4 w-full items-center my-4">
                <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                  <Info /> No Punch Request Found
                </h1>
              </div>
            ) : (
              <>
                <div className="p-4 space-y-1 flex items-center gap-3">
                  <Avatar className="text-white !bg-blue-500">
                    <AssignmentTurnedInIcon />
                  </Avatar>
                  <div>
                    <h1 className=" md:text-xl text-lg ">Shift Status</h1>
                    <p className="text-sm">
                      Here employee's would be able to check the status of their
                      shift requests
                    </p>
                  </div>
                </div>
                <div className="md:px-4 px-0">
                  {EmpNotification?.requests?.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="w-full bg-white shadow-md mb-3 p-4 rounded-md"
                    >
                      <div className="flex justify-between items-center px-2">
                        <div className="w-[500px]">
                          <h2>
                            <span className=" md:text-lg text-base font-semibold">
                              <span>from : </span>
                              {new Date(item?.start).toLocaleDateString()}
                            </span>{" "}
                          </h2>
                          <h2>
                            <span className=" md:text-lg text-base font-semibold">
                              <span>to :</span>{" "}
                              {new Date(item?.end).toLocaleDateString()}
                            </span>{" "}
                          </h2>
                          <h2>
                            <span className=" md:text-lg text-base font-semibold">
                              <span>manager status :</span> {item?.status}
                            </span>{" "}
                          </h2>
                          <h2>
                            <span className=" md:text-lg text-base font-semibold">
                              <span>
                                accountant status : {item?.accountantStatus}
                              </span>
                            </span>{" "}
                          </h2>
                        </div>

                        <button
                          className={`md:w-[100px] h-[30px] md:h-auto ${item.status === "Pending"
                            ? "bg-[#ffa500]"
                            : item.status === "Approved"
                              ? "bg-[#008000]"
                              : "bg-[#ff0000]"
                            } text-white md:px-4 px-2 py-1 md:py-2 rounded-md`}
                        >
                          {item.status}
                        </button>
                      </div>
                    </div>
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
export default EmpShiftNotification;
