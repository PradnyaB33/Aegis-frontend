// import { Skeleton } from "@mui/material";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import React, { useContext, useEffect } from "react";
// import { Pie } from "react-chartjs-2";
// import useLeaveTable from "../../../../hooks/Leave/useLeaveTable";
// import axios from "axios";
// import { UseContext } from "../../../../State/UseState/UseContext";
// import { useParams } from "react-router-dom";
// import { useQuery } from "react-query";

// const EmployeeAllLeavePie = () => {
//     const { cookies } = useContext(UseContext);
//     const authToken = cookies["aegis"];
//     const param = useParams();
//     const organisationId = param?.id;
//     const RemainingLeaves = useLeaveTable();
//     const { data: remainingLeaves, isLoading } = RemainingLeaves;
//     console.log("remainingLeaves", remainingLeaves);

//     useEffect(() => {
//         AOS.init({ duration: 800, once: true });
//     }, []);



//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: true,
//                 position: "right",
//                 labels: {
//                     color: "#444",
//                     font: {
//                         size: 14,
//                     },
//                 },
//             },
//         },
//     };

//     const { data: totalLeaves, isLoading1 } = useQuery(
//         "totalLeaves",
//         async () => {
//             const response = await axios.get(
//                 `${process.env.REACT_APP_API}/route/get-all-leave-count/${organisationId}`,
//                 {
//                     headers: {
//                         Authorization: authToken,
//                     },
//                 }
//             );
//             return response.data;
//         },
//         {
//             enabled: !!authToken,
//         }
//     );
//     console.log("totalLeaves", totalLeaves);
//     console.log("data", data);

//     return (
//         <article
//             className="mb-2 w-full  h-max bg-white rounded-md shadow-sm "
//         >
//             <div className="flex flex-col ">
//                 <h1
//                     className="text-lg  font-semibold text-[#67748E] pt-4 px-4 mb-2"
//                 >
//                     My Leave
//                 </h1>
//                 <br />
//                 {isLoading ? (
//                     <div className="flex items-center justify-center w-full h-54">
//                         <Skeleton
//                             variant="rounded"
//                             width="100%"
//                             height="100%"
//                             animation="wave"
//                         />
//                     </div>
//                 ) : (
//                     <div className="w-full h-54 pb-4">
//                         <Pie data={data} options={options} />
//                     </div>
//                 )}
//             </div>
//         </article>
//     );
// };

// export default EmployeeAllLeavePie;



import { Skeleton } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useContext, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import useLeaveTable from "../../../../hooks/Leave/useLeaveTable";
import axios from "axios";
import { UseContext } from "../../../../State/UseState/UseContext";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

const EmployeeAllLeavePie = () => {
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const param = useParams();
    const organisationId = param?.id;
    const RemainingLeaves = useLeaveTable();
    const { data: remainingLeaves, isLoading } = RemainingLeaves;

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "right",
                labels: {
                    color: "#444",
                    font: {
                        size: 12, // Reduce font size for better readability in a smaller chart
                    },
                },
            },
        },
    };

    const { data: totalLeaves, isLoading1 } = useQuery(
        "totalLeaves",
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/get-all-leave-count/${organisationId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data;
        },
        {
            enabled: !!authToken,
        }
    );

    // Calculate taken leaves
    const takenLeavesData = remainingLeaves?.leaveTypes
        .map((leave) => {
            const totalLeave = totalLeaves?.data.find(
                (totalLeave) => totalLeave._id === leave._id
            );
            return {
                ...leave,
                takenCount: totalLeave ? totalLeave.count - leave.count : 0, // Calculate the taken count
            };
        })
        .filter((leave) => leave.takenCount > 0); // Filter leaves with taken count greater than zero

    // Prepare data for Pie chart
    const pieChartData = {
        labels: takenLeavesData?.map((leave) => leave.leaveName),
        datasets: [
            {
                data: takenLeavesData?.map((leave) => leave.takenCount),
                backgroundColor: takenLeavesData?.map((leave) => leave.color),
                hoverBackgroundColor: takenLeavesData?.map((leave) => leave.color),
            },
        ],
    };

    return (
        <article className="mb-2 w-full ">
            <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-semibold text-[#67748E] mb-4">
                    My Leave
                </h1>
                {isLoading || isLoading1 ? (
                    <div className="flex items-center justify-center w-full ">
                        <Skeleton
                            variant="rounded"
                            width="100%"
                            height="100%"
                            animation="wave"
                        />
                    </div>
                ) : (
                    <div className="h-[200px] px-6 border-[0.5px] border-[#E5E7EB] bg-white rounded-lg shadow-sm" style={{ padding: '0px', margin: '0px' }}>
                        <div className="relative flex justify-center h-full"> {/* Ensure the inner div takes full height */}
                            <div className="w-full h-full max-w-[300px]"> {/* Ensure the Pie chart fits within 200px */}
                                <Pie data={pieChartData} options={options} />
                            </div>
                        </div>
                    </div>

                )}
            </div>
        </article>
    );
};

export default EmployeeAllLeavePie;
