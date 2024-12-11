import { Info, RequestQuote, Search } from "@mui/icons-material";
import { Avatar, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import usePunchNotification from "../../../hooks/QueryHook/notification/punch-notification/hook";
import useAuthToken from "../../../hooks/Token/useAuth";
import PunchMapModal from "./components/mapped-form";
import HeadingOneLineInfo from "../../HeadingOneLineInfo/HeadingOneLineInfo";

const GeoFencingAcceptModal = () => {
    // Hooks
    const [employeeId, setEmployeeId] = useState();
    const queryClient = useQueryClient();
    const { data: punchNotifications } = usePunchNotification();

    const authToken = useAuthToken();
    const [selectedPunchId, setSelectedPunchId] = useState(null);
    console.log("selectedPunchId", selectedPunchId);

    const geoFence = "geoFence";

    const [searchTerm, setSearchTerm] = useState("");

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
        // Find the punch notification that matches the clicked employee
        const punchData = punchNotifications?.punchNotification?.find(
            (notification) => notification?.employeeId?._id === employeeId
        );

        if (punchData) {
            setEmployeeId(employeeId); // Set employeeId here
            setSelectedPunchId(punchData._id);
            mutation.mutate({ employeeId, punchId: punchData._id });
        }
    };

    // Handle employee search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
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
                            > <Search className="text-gray-700 md:text-lg !text-[1em]" />
                                <input
                                    type="text"
                                    placeholder="Search Employee"
                                    className="border-none bg-white w-full outline-none px-2"
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
                                    notification?.geoFencingArea === true && notification?.employeeId
                            )
                            .reduce((acc, notification) => {
                                const email = notification?.employeeId?.email;
                                if (!acc.some((item) => item?.employeeId?.email === email)) {
                                    acc.push(notification);
                                }
                                return acc;
                            }, [])
                            .map((notification, idx) =>
                                notification?.employeeId ? (
                                    <Link
                                        onClick={() => handleEmployeeClick(notification?.employeeId?._id)}
                                        className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 ${notification?.employeeId?._id === employeeId ? "bg-blue-500 text-white hover:!bg-blue-300" : ""
                                            }`}
                                        key={idx}
                                    >
                                        <Avatar />
                                        <div>
                                            <h1 className="text-[1.2rem]">
                                                {notification?.employeeId?.first_name} {notification?.employeeId?.last_name}
                                            </h1>
                                            <h1 className={`text-sm text-gray-500 ${notification?.employeeId?._id === employeeId ? "text-white" : ""}`}>
                                                {notification?.employeeId?.email}
                                            </h1>
                                        </div>
                                    </Link>
                                ) : null
                            )
                    }
                </article>

                {/* Show particular employee data */}
                <article className="w-[75%] min-h-[90vh] border-l-[.5px] ">
                    <div className="px-4 pt-2">
                        <HeadingOneLineInfo
                            heading={"Geo Fence Requests"}
                            info={
                                "Here manager can manage the geo fence requests"
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
                                    <Info /> No Geo Fencing Request Found
                                </h1>
                            </div>
                        ) : (
                            <div className="">
                                <div className="p-4 space-y-1 flex items-center gap-3" style={{ borderBottom: "1px solid #e5e7eb" }}>
                                    <Avatar className="text-white !bg-blue-500">
                                        <RequestQuote />
                                    </Avatar>
                                    <div>
                                        <h1 className="text-xl">Geo Fencing Requests</h1>
                                        <p className="text-sm">
                                            Here you will be able to approve or reject the geo fencing
                                            notifications
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    {EmpNotification?.punchNotification
                                        ?.filter((notification) => notification.geoFencingArea === true) // Filter by geoFencingArea
                                        ?.map((items, itemIndex) => (
                                            <PunchMapModal
                                                key={itemIndex}
                                                items={items}
                                                idx={itemIndex}
                                                geoFence={geoFence}
                                            />
                                        ))}
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="flex px-4 w-full items-center my-4">
                            <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                                <Info /> Select an employee to see their requests
                            </h1>
                        </div>
                    )}
                </article>
            </section>
        </div>
    );
};

export default GeoFencingAcceptModal;
