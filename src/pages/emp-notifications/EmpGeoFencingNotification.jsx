import { Info, West } from "@mui/icons-material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { Avatar, CircularProgress } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import useAuthToken from "../../hooks/Token/useAuth";
import UserProfile from "../../hooks/UserData/useUser";

const EmpGeoFencingNotification = () => {
    const authToken = useAuthToken();
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const employeeId = user?._id;
    const queryClient = useQueryClient();

    const { data: EmpNotification, isLoading: empDataLoading } = useQuery({
        queryKey: ["EmpDataPunchNotification", employeeId],
        queryFn: async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API}/route/punch/get-notification/${employeeId}`,
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
    console.log("EmpNotification", EmpNotification);

    const punchId = EmpNotification?.punchData?.[0]?._id;

    // Mutation to update notification count
    const { mutate: updateNotificationCount } = useMutation(
        async () => {
            try {
                const res = await axios.patch(
                    `${process.env.REACT_APP_API}/route/update/notificationCount/punch/manager/accept/${employeeId}`,
                    { organizationId: user.organizationId, punchId },
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
        {
            onSuccess: () => {
                console.log("Notification count updated successfully.");
                queryClient.invalidateQueries("EmpDataPunchNotification");
            },
            onError: (error) => {
                console.error("Error updating notification count:", error);
            },
        }
    );

    useEffect(() => {
        if (!empDataLoading && EmpNotification) {
            updateNotificationCount();
        }
    }, [empDataLoading, EmpNotification, updateNotificationCount]);

    // Filter notifications where geoFencingArea is true
    const filteredNotifications = EmpNotification?.punchData?.filter(
        (item) => item.geoFencingArea === true
    ) || [];

    return (
        <div>
            <header className="text-xl w-full pt-6 border bg-white shadow-md p-4">
                <Link to={"/organisation/:organisationId/income-tax"}>
                    <West className="mx-4 !text-xl" />
                </Link>
                Employee Geo Fencing Status
            </header>
            <section className="min-h-[90vh] flex  ">
                <article className="w-[100%] min-h-[90vh] border-l-[.5px]  bg-gray-50">
                    {empDataLoading ? (
                        <div className="flex items-center justify-center my-2">
                            <CircularProgress />
                        </div>
                    ) : employeeId ? (
                        filteredNotifications.length === 0 ? (
                            <div className="flex px-4 w-full items-center my-4">
                                <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                                    <Info /> No Geo Fencing Request Found
                                </h1>
                            </div>
                        ) : (
                            <>
                                <div className="p-4 space-y-1 flex items-center gap-3">
                                    <Avatar className="text-white !bg-blue-500">
                                        <AssignmentTurnedInIcon />
                                    </Avatar>
                                    <div>
                                        <h1 className=" md:text-xl text-lg ">Punch Status</h1>
                                        <p className="text-sm">
                                            Here employees would be able to check the status of their
                                            geo fencing requests
                                        </p>
                                    </div>
                                </div>
                                <div className="md:px-4 px-0">
                                    {filteredNotifications.map((item, itemIndex) => (
                                        <div
                                            key={itemIndex}
                                            className="w-full bg-white shadow-md mb-3 p-4 rounded-md"
                                        >
                                            <div className="flex justify-between items-center px-2">
                                                <div>
                                                    <h2 className="md:text-lg text-base font-semibold">
                                                        {item.punchData[0].image === ""
                                                            ? "Missed Punch Request"
                                                            : "Geo Fencing Request"}
                                                    </h2>
                                                    <h2>
                                                        <span className=" md:text-lg text-base font-semibold">
                                                            Date
                                                        </span>{" "}
                                                        : {new Date(item?.createdAt).toLocaleDateString()}
                                                    </h2>
                                                    <h2>
                                                        <span className="md:text-lg text-base font-semibold">
                                                            Start Time
                                                        </span>{" "}
                                                        {new Date(
                                                            item?.punchData[0]?.createdAt
                                                        ).toLocaleTimeString()}
                                                    </h2>
                                                    <h2>
                                                        <span className=" md:text-lg text-base font-semibold">
                                                            End Time
                                                        </span>{" "}
                                                        {new Date(
                                                            item?.punchData[0]?.updatedAt
                                                        ).toLocaleTimeString()}
                                                    </h2>
                                                    <h2>
                                                        <span className=" md:text-lg text-base font-semibold">
                                                            Geo Fencing Requested
                                                        </span>{" "}
                                                        : {item?.punchData?.length}{" "}
                                                        {item?.punchData?.length === 1 ? "time" : "times"}
                                                    </h2>
                                                    {item?.mReason && (
                                                        <h2>
                                                            <span className=" md:text-lg text-base font-semibold">
                                                                {"Reason --> Manager"}
                                                            </span>{" "}
                                                            : {item?.mReason}
                                                        </h2>
                                                    )}
                                                    {item?.aReason && (
                                                        <h2>
                                                            <span className=" md:text-lg text-base font-semibold">
                                                                {"Reason --> Accountant"}
                                                            </span>{" "}
                                                            : {item?.aReason}
                                                        </h2>
                                                    )}
                                                </div>

                                                <div className="flex flex-col items-center justify-center gap-2 ">
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
                                                    <div className="text-sm text-gray-700 underline">
                                                        {moment(item?.updatedAt).fromNow()}
                                                    </div>
                                                </div>
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

export default EmpGeoFencingNotification;
