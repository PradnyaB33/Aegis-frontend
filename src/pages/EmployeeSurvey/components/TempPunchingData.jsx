import { IconButton } from "@mui/material";
import React, { useContext } from "react";
import { West } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";

const TempPunchingData = () => {
    // Hooks
    const navigate = useNavigate();
    const param = useParams();
    const organisationId = param?.organisationId;

    // Get cookies
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    // Get response surveys
    const { data: tempPunchData } = useQuery(
        ["tempPunchData", organisationId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-temp-punching-data`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data;
        },
        {
            enabled: !!organisationId && !!authToken,
        }
    );

    console.log("tempPunchData", tempPunchData);

    return (
        <div className="bg-gray-50 min-h-screen h-auto">
            <header className="text-xl w-full pt-6 flex flex-col md:flex-row items-start md:items-center gap-2 bg-white shadow-md p-4">
                {/* Back Button */}
                <div className="flex-shrink-0">
                    <IconButton onClick={() => navigate(-1)}>
                        <West className="text-xl" />
                    </IconButton>
                </div>

                {/* Main Header Content */}
                <div className="flex flex-col md:flex-row justify-between w-full md:ml-4">
                    <div className="mb-2 md:mb-0 md:mr-4">
                        <h1 className="text-xl font-bold">Live Data</h1>
                    </div>
                </div>
            </header>
            <section className="xs:px-8 xs:py-2">
                <>
                    <div className="px-4 py-2 bg-white w-full h-max shadow-md rounded-2m border my-8">
                        <div className="overflow-auto !p-0 border-[.5px] border-gray-200 mt-4">
                            <table className="min-w-full bg-white text-left !text-sm font-light">
                                <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                                    <tr className="!font-semibold">
                                        <th scope="col" className="!text-left pl-8 py-3">
                                            Org_Id
                                        </th>
                                        <th scope="col" className="!text-left pl-8 py-3">
                                            Emp id
                                        </th>
                                        <th scope="col" className="!text-left pl-8 py-3">
                                            First Name
                                        </th>
                                        <th scope="col" className="!text-left pl-8 py-3">
                                            Department
                                        </th>
                                        <th scope="col" className="!text-left pl-8 py-3">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tempPunchData?.map((data, index) => (
                                        <tr key={index} className="!font-medium border-b">
                                            <td className="!text-left pl-8 py-3">{data.Org_Id}</td>
                                            <td className="!text-left pl-8 py-3">{data['Employee ID']}</td>
                                            <td className="!text-left pl-8 py-3">{data['First Name']}</td>
                                            <td className="!text-left pl-8 py-3">{data.Department}</td>
                                            <td className="!text-left pl-8 py-3">{data.Date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            </section>
        </div>
    );
};

export default TempPunchingData;
