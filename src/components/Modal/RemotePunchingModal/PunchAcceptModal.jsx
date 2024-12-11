import { Info, Search } from "@mui/icons-material";
import { Avatar, CircularProgress, Box } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import usePunchNotification from "../../../hooks/QueryHook/notification/punch-notification/hook";
import useAuthToken from "../../../hooks/Token/useAuth";
import PunchMapModal from "./components/mapped-form";
import HeadingOneLineInfo from "../../HeadingOneLineInfo/HeadingOneLineInfo";


const PunchAcceptModal = () => {
  // Hooks

  const queryClient = useQueryClient();
  const { data: punchNotifications } = usePunchNotification();
  const authToken = useAuthToken();
  const [selectedPunchId, setSelectedPunchId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  console.log("selectedPunchId", selectedPunchId);
  const [employeeId, setEmployeeId] = useState();
  // Mutation to update notification count
  const mutation = useMutation(
    ({ employeeId, punchId }) => {
      return axios.patch(
        `${process.env.REACT_APP_API}/route/punch-notification/update-notification-count/${employeeId}`,
        { notificationCount: 0, selectedPunchId: punchId },
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
        queryClient.invalidateQueries("EmpDataPunch");
        queryClient.invalidateQueries("punch-request");
      },
      onError: (error) => {
        console.error("Error updating notification count:", error);
      },
    }
  );

  // Get particular employee punching and miss punch data
  const { data: EmpNotification, isLoading: empDataLoading } = useQuery({
    queryKey: ["EmpDataPunch", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/punch-notification/notification-user/${employeeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.error("Error fetching employee notification data:", error);
      }
    },
    enabled: Boolean(employeeId),
  });

  // Function to handle employee click and set punchId
  const handleEmployeeClick = (employeeId) => {
    setEmployeeId(employeeId);
    // Find the punch notification that matches the clicked employee
    const punchData = punchNotifications?.punchNotification?.find(
      (notification) => notification?.employeeId?._id === employeeId
    );

    if (punchData) {
      setSelectedPunchId(punchData._id);
      mutation.mutate({ employeeId, punchId: punchData._id });
    }
  };

  // Handle employee search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <Box>
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
                  type="text"
                  placeholder="Search Employee"
                  className={`border-none bg-white w-full outline-none px-2  `}
                  value={searchTerm}
                  onChange={handleSearch} // Search input handler
                />
              </div>
            </div>
          </div>
          {
            punchNotifications?.punchNotification
              ?.filter(
                (notification) =>
                  notification?.geoFencingArea === false && notification?.employeeId // Filtering based on geoFencingArea being false
              )
              .reduce((unique, notification) => {
                // Check if an employee with the same email and first name already exists
                const isDuplicate = unique.some(
                  (item) =>
                    item?.employeeId?.email === notification?.employeeId?.email &&
                    item?.employeeId?.first_name === notification?.employeeId?.first_name
                );
                // If not a duplicate, add to the unique list
                if (!isDuplicate) unique.push(notification);
                return unique;
              }, [])
              .map((notification, idx) =>
                notification?.employeeId ? (
                  <Link
                    onClick={() => handleEmployeeClick(notification?.employeeId?._id)} // Click handler
                    // to={`/punch-notification/${notification?.employeeId?._id}`}
                    className={`px-1 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 ${notification?.employeeId?._id === employeeId
                      ? "bg-blue-500 text-white hover:!bg-blue-300"
                      : ""
                      }`}
                    key={idx}
                  >
                    <div className="hidden sm:block">
                      <Avatar />
                    </div>
                    <div>
                      <h1 className="text-[1.2rem]">
                        {notification?.employeeId?.first_name} {notification?.employeeId?.last_name}
                      </h1>
                      <h1
                        className={`text-sm text-gray-500 ${notification?.employeeId?._id === employeeId ? "text-white" : ""
                          }`}
                      >
                        {notification?.employeeId?.email}
                      </h1>
                    </div>
                  </Link>
                ) : null
              )
          }

        </article>

        {/* Show particular employee data */}
        <article className="w-[75%] min-h-[90vh] border-l-[.5px]  bg-gray-50">
          <div className="px-4 pt-2">
            <HeadingOneLineInfo
              heading={"Remote Punch Requests"}
              info={
                "Here manager can manage the remote punch requests"
              }
            /></div>
          {empDataLoading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress />
            </div>
          ) : employeeId ? (
            EmpNotification?.punchNotification?.length <= 0 ? (
              <div className="flex px-4 w-full items-center my-4">
                <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                  <Info /> No Remote Punch Request Found
                </h1>
              </div>
            ) : (
              <>
                <div className="px-4">
                  {EmpNotification?.punchNotification
                    ?.filter((notification) => notification.geoFencingArea === false) // Filter by geoFencingArea
                    ?.map((items, itemIndex) => (
                      <PunchMapModal key={itemIndex} items={items} idx={itemIndex} />
                    ))}
                </div>
              </>
            )
          ) : (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> Select employee to see their requests
              </h1>
            </div>
          )}
        </article>
      </section>
    </Box >
  );
};

export default PunchAcceptModal;
