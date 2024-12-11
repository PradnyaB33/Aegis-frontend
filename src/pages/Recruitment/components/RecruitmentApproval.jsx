import axios from "axios";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import useGetUser from "../../../hooks/Token/useUser";
import { Avatar, CircularProgress } from "@mui/material";

const RecruitmentApproval = () => {
    const { authToken } = useGetUser();
    const { organisationId } = useParams();
    const queryClient = useQueryClient();

    // Fetch data using react-query
    const {
        data,
        isLoading,
        isFetching,
        error
    } = useQuery({
        queryKey: ["RecruitmentApproval", organisationId],
        queryFn: async () => {
            const res = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager-job-permissions`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return res.data;
        },
        enabled: !!authToken && !!organisationId,
    });

    // Mutation to update the status
    const { mutate: updateStatus } = useMutation(
        async ({ permissionId, status }) => {
            const res = await axios.patch(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-permissions/${permissionId}`,
                { status },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return res.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["RecruitmentApproval", organisationId]);
            },
        }
    );

    const handleAction = (permissionId, status) => {
        updateStatus({ permissionId, status });
    };

    if (isLoading || isFetching) {
        return (
            <div className="flex justify-center items-center min-h-[90vh]">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[90vh]">
                <h1>Error loading data.</h1>
            </div>
        );
    }

    return (
        <div>
            <section className="min-h-[90vh] flex">
                <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
                    <div className="p-2 my-2 !py-2">
                        <div className="space-y-2">
                            <div
                                className="flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]"
                            >
                                <input
                                    type={"text"}
                                    placeholder={"Search Employee"}
                                    className="border-none bg-white w-full outline-none px-2"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {/* Display Employees */}
                        {data?.data?.map((permission, idx) => (
                            <Link
                                key={idx}
                                to={`/employee-details/${permission.employeeId?._id}`}
                                className="px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50"
                            >
                                <Avatar />
                                <div>
                                    <h1 className="md:text-[1.2rem] text-sm">
                                        {permission.employeeId?.name}
                                    </h1>
                                    <h1 className="md:text-sm text-xs text-gray-500">
                                        {permission.employeeId?.email}
                                    </h1>
                                </div>
                            </Link>
                        ))}
                    </div>
                </article>


                <article className="w-[75%] min-h-[90vh] border-l-[.5px]  bg-gray-50">
                    <div className="px-4 pt-2">
                        <h1 className="text-xl font-semibold">Job Application Permissions</h1>
                        <p className="text-sm text-gray-600">
                            Approve or reject job application requests.
                        </p>
                    </div>

                    <div className="px-4 pt-2">
                        {data?.data?.length === 0 ? (
                            <div className="flex items-center justify-center my-4">
                                <h1 className="text-lg w-full text-gray-700 bg-blue-200 p-4 rounded-md">
                                    No Job Requests Found
                                </h1>
                            </div>
                        ) : (
                            data.data.map((permission, idx) => (
                                <div key={idx} className="p-4 border my-2 rounded-md">
                                    <h2 className="text-xl font-bold">{permission.jobId?.title}</h2>
                                    <p className="text-sm">
                                        {permission.employeeId?.first_name}{" "}
                                        {permission.employeeId?.last_name}
                                    </p>
                                    <p className="text-sm">
                                        Job Position: {permission.jobId?.jobPosition}
                                    </p>
                                    <p className="text-sm">
                                        Status: {permission.managerApproval}
                                    </p>

                                    <div className="flex gap-4 mt-2">
                                        <button
                                            onClick={() => handleAction(permission._id, "Approved")}
                                            className="bg-green-500 text-white px-4 py-2 rounded"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(permission._id, "Rejected")}
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </article>
            </section>
        </div >
    );
};

export default RecruitmentApproval;
