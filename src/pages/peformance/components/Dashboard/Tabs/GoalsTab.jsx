import { format } from "date-fns";
import React from "react";
import EmptyAlertBox from "../../../../../components/EmptyAlertBox";
import usePerformanceApi from "../../../../../hooks/Performance/usePerformanceApi";

const GoalsTab = () => {
  const { dashboardData: empData } = usePerformanceApi();
  return (
    <section>
      <h1 className="text-lg text-[#67748E]  mb-2 font-bold">
        Employee Goals{" "}
      </h1>
      {empData?.goals?.length === 0 ? (
        <EmptyAlertBox title={"Goals not found for this employee"} />
      ) : (
        <table className=" overflow-auto table-fixed  border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
          <thead className="border-b bg-gray-100 font-bold">
            <tr className="!font-semibold ">
              <th scope="col" className="!text-left px-2 w-max py-3 text-sm ">
                Sr. No
              </th>
              <th scope="col" className="py-3 text-sm px-2 ">
                Goal Name
              </th>
              {/* <th scope="col" className="py-3 text-sm px-2 ">
                        Goal Measurements
                      </th> */}
              <th scope="col" className="py-3 text-sm px-2 ">
                Timeline
              </th>

              <th scope="col" className="py-3 text-sm px-2 ">
                Goal status
              </th>
            </tr>
          </thead>
          <tbody>
            {empData?.goals?.map((goal, index) => (
              <tr className={` hover:bg-gray-50 !font-medium  w-max border-b `}>
                <td className="!text-left  cursor-pointer py-4 px-2 text-sm w-max  ">
                  {index + 1}
                </td>
                <td className="w-max px-2 hover:bg-gray-50 !font-medium   border-b">
                  {goal?.goal}
                </td>
                {/* <td
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(goal?.measurments),
                          }}
                          className="w-max px-2 hover:bg-gray-50 !font-medium   border-b"
                        ></td> */}

                <td className="w-max px-2 hover:bg-gray-50 !font-medium   border-b">
                  {format(new Date(goal?.startDate), "PP")} -{" "}
                  {format(new Date(goal?.endDate), "PP")}
                </td>
                <td
                  className={`
                       
                        w-max px-2 hover:bg-gray-50 !font-medium   border-b`}
                >
                  <div
                    className={`font-bold  rounded-md w-max  ${
                      new Date(goal?.endDate) < new Date()
                        ? " !text-orange-500 "
                        : goal?.goalStatus === "Not started"
                        ? " !text-gray-500 "
                        : goal?.goalStatus === "In Progress"
                        ? " !text-blue-500 "
                        : goal?.goalStatus === "Completed"
                        ? " !text-green-500 "
                        : " !text-gray-500 "
                    }`}
                  >
                    {new Date(goal?.endDate) < new Date()
                      ? "Over Due"
                      : goal?.goalStatus ?? "-"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default GoalsTab;
