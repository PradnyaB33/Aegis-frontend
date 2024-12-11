// import axios from 'axios';
// import React, { useContext } from "react";
// import { useNavigate, useParams } from 'react-router-dom';
// import { useQuery } from "react-query";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { Button } from '@mui/material';
// import ExcelJS from 'exceljs';
// import { format } from "date-fns";

// const ModalForStatusShow = ({ taskData }) => {
//     console.log("taskData", taskData);

//     const { organisationId } = useParams();
//     const navigate = useNavigate();
//     const { cookies } = useContext(UseContext);
//     const authToken = cookies["aegis"];

//     // Get employee data for the "to" field
//     const { data: employees } = useQuery(
//         ["employee", organisationId],
//         async () => {
//             const response = await axios.get(
//                 `${process.env.REACT_APP_API}/route/employee/${organisationId}/get-emloyee`,
//                 {
//                     headers: {
//                         Authorization: authToken,
//                     },
//                 }
//             );
//             return response.data.employees;
//         }
//     );

//     if (!taskData) {
//         return <div>No task data available.</div>;
//     }

//     const handleComplete = (email, punchObjectId) => {
//         const employee = employees.find(emp => emp.email === email);
//         console.log("employsdasdsaee", punchObjectId);

//         if (employee) {
//             navigate(`/organisation/${organisationId}/remote-task/${employee._id}/${punchObjectId}`);
//         } else {
//             console.error("Employee not found");
//         }
//     }

//     const generateExcel = async () => {
//         const workbook = new ExcelJS.Workbook();

//         // Main Worksheet for Task Data
//         const taskWorksheet = workbook.addWorksheet('Task Data');

//         // Add title and description to the top of the sheet
//         taskWorksheet.mergeCells('A1:E1');
//         taskWorksheet.getCell('A1').value = `Title: ${taskData.title}`;
//         taskWorksheet.getCell('A1').font = { bold: true };
//         taskWorksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'left' };

//         taskWorksheet.mergeCells('A2:E2');
//         taskWorksheet.getCell('A2').value = `Description: ${taskData.description}`;
//         taskWorksheet.getCell('A2').font = { bold: true };
//         taskWorksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'left' };

//         // Adjust row height for title and description
//         taskWorksheet.getRow(1).height = 30;
//         taskWorksheet.getRow(2).height = 30;

//         // Add a blank row to separate title/description from data
//         taskWorksheet.addRow([]);

//         // Add column headers
//         const headerRow = taskWorksheet.addRow(['Task', 'Email', 'Distance', 'Status', 'Comments']);
//         headerRow.font = { bold: true };
//         taskWorksheet.columns = [
//             { width: 30 },
//             { width: 30 },
//             { width: 15 },
//             { width: 20 },
//             { width: 50 },
//         ];

//         // Map to store total distance user-wise
//         const userDistanceMap = {};

//         // Track processed punchObjectIds
//         const processedPunchIds = new Set();

//         // Add data rows to the main worksheet
//         taskData.taskName.forEach((taskItem) => {
//             taskData.to.forEach((email) => {
//                 const acceptedByEntry = taskItem.acceptedBy.find(
//                     (entry) => entry.employeeEmail === email.value
//                 );

//                 let distance = 0;
//                 if (
//                     acceptedByEntry?.punchObjectId?.distance &&
//                     !processedPunchIds.has(acceptedByEntry.punchObjectId.id)
//                 ) {
//                     distance = Number(acceptedByEntry.punchObjectId.distance).toFixed(3);
//                     processedPunchIds.add(acceptedByEntry.punchObjectId.id);

//                     // Add distance to the user's total
//                     if (!userDistanceMap[email.label]) {
//                         userDistanceMap[email.label] = 0;
//                     }
//                     userDistanceMap[email.label] += Number(distance);
//                 }

//                 taskWorksheet.addRow([
//                     taskItem.taskName,
//                     email.label,
//                     distance || '',
//                     acceptedByEntry
//                         ? acceptedByEntry.status
//                             ? acceptedByEntry.status === "Completed"
//                                 ? 'Completed'
//                                 : acceptedByEntry.status
//                             : acceptedByEntry.accepted
//                                 ? 'Accept'
//                                 : 'Reject'
//                         : 'Assigned',
//                     acceptedByEntry ? acceptedByEntry.comments : '',
//                 ]);
//             });
//         });

//         // Create a new worksheet for the summary
//         const summaryWorksheet = workbook.addWorksheet('User-Wise Totals');

//         // Add title to the summary sheet
//         summaryWorksheet.mergeCells('A1:B1');
//         summaryWorksheet.getCell('A1').value = 'User-Wise Total Distances';
//         summaryWorksheet.getCell('A1').font = { bold: true };
//         summaryWorksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'left' };
//         summaryWorksheet.getRow(1).height = 25;

//         // Add column headers
//         summaryWorksheet.addRow(['Email', 'Total Distance']);
//         summaryWorksheet.getRow(2).font = { bold: true };

//         // Add data rows to the summary sheet
//         Object.entries(userDistanceMap).forEach(([email, totalDistance]) => {
//             summaryWorksheet.addRow([email, totalDistance.toFixed(3)]);
//         });

//         // Format columns in the summary sheet
//         summaryWorksheet.columns = [
//             { width: 30 },
//             { width: 15 },
//         ];

//         // Generate Excel file and trigger download
//         workbook.xlsx.writeBuffer().then((buffer) => {
//             const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.download = 'task_data.xlsx';
//             link.click();
//             window.URL.revokeObjectURL(url);
//         });
//     };


//     return (
//         <div className="overflow-auto">
//             <div>
//                 <h2 className="text-2xl mb-2">{taskData?.title}</h2>
//                 <p className="text-sm text-muted-foreground">
//                     {taskData?.description}
//                 </p><br />

//             </div>
//             <table className="w-full table-auto border border-collapse min-w-full bg-white text-left !text-sm font-light">
//                 <thead className="border-b bg-gray-100 font-bold">
//                     <tr className="!font-semibold">
//                         <th scope="col" className="py-3 text-sm px-2">Task</th>
//                         <th scope="col" className="py-3 text-sm px-2">Email</th>
//                         <th scope="col" className="py-3 text-sm px-2">Distance</th>
//                         <th scope="col" className="py-3 text-sm px-2">Date</th>
//                         <th scope="col" className="!text-left px-2 w-max py-3 text-sm">Status</th>
//                         <th scope="col" className="!text-left px-2 w-max py-3 text-sm">Comments</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {taskData.taskName.map((taskItem) =>
//                         taskData.to.map((email) => {
//                             const acceptedByEntry = taskItem.acceptedBy.find(
//                                 (entry) => entry.employeeEmail === email.value
//                             );
//                             return (
//                                 <tr className="border-b" key={`${taskItem._id}-${email.value}`}>
//                                     <td className="py-3 px-2">{taskItem.taskName}</td>
//                                     <td className="py-3 px-2">{email.label}</td>
//                                     <td className="py-3 px-2">{acceptedByEntry?.punchObjectId?.distance
//                                         ? Number(acceptedByEntry.punchObjectId.distance).toFixed(3)
//                                         : ""}</td>
//                                     <td className="py-3 px-2">
//                                         {acceptedByEntry?.punchObjectId?.createdAt
//                                             ? format(new Date(acceptedByEntry.punchObjectId.createdAt), "PP")
//                                             : "-"}
//                                     </td>
//                                     <td className="py-3 px-2 " >
//                                         {acceptedByEntry
//                                             ? acceptedByEntry.status
//                                                 ? acceptedByEntry.status === "Completed"
//                                                     ? <Button sx={{ textTransform: "none" }} onClick={() => handleComplete(email.value, acceptedByEntry?.punchObjectId)}>Completed</Button>
//                                                     : acceptedByEntry.status
//                                                 : acceptedByEntry.accepted
//                                                     ? 'Accept'
//                                                     : 'Reject'
//                                             : 'Assigned'}
//                                     </td>
//                                     <td className="py-3 px-2">
//                                         {acceptedByEntry ? acceptedByEntry.comments : ''}
//                                     </td>
//                                 </tr>
//                             );
//                         })
//                     )}
//                 </tbody>
//             </table><br />
//             <div className='flex justify-end'>
//                 <Button sx={{ display: "flex", justifyContent: "right" }} variant="contained" onClick={generateExcel}>
//                     Download Excel
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default ModalForStatusShow;


import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import { Button } from "@mui/material";
import ExcelJS from "exceljs";
import { format } from "date-fns";
import axios from "axios";

const ModalForStatusShow = ({ taskData }) => {
    const { organisationId } = useParams();
    const navigate = useNavigate();
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    const { data: employees } = useQuery(
        ["employee", organisationId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/employee/${organisationId}/get-emloyee`,
                { headers: { Authorization: authToken } }
            );
            return response.data.employees;
        }
    );

    if (!taskData) {
        return <div>No task data available.</div>;
    }

    const handleComplete = (email, punchObjectId) => {
        const employee = employees.find((emp) => emp.email === email);
        if (employee) {
            navigate(`/organisation/${organisationId}/remote-task/${employee._id}/${punchObjectId}`);
        } else {
            console.error("Employee not found");
        }
    };

    // const filteredTaskData = taskData.taskName.map((taskItem) => {
    //     const filteredTo = taskData.to.filter((email) => {
    //         const acceptedByEntry = taskItem.acceptedBy.find(
    //             (entry) => entry.employeeEmail === email.value
    //         );

    //         if (!acceptedByEntry?.punchObjectId?.createdAt) return false;

    //         const date = new Date(acceptedByEntry.punchObjectId.createdAt);
    //         const yearMatches = selectedYear ? date.getFullYear() === Number(selectedYear) : true;
    //         const monthMatches = selectedMonth ? date.getMonth() + 1 === Number(selectedMonth) : true;

    //         return yearMatches && monthMatches;
    //     });

    //     return { ...taskItem, filteredTo };
    // });

    const generateExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const taskWorksheet = workbook.addWorksheet("Filtered Task Data");

        // Add title and description
        taskWorksheet.mergeCells("A1:E1");
        taskWorksheet.getCell("A1").value = `Title: ${taskData.title}`;
        taskWorksheet.getCell("A1").font = { bold: true };
        taskWorksheet.mergeCells("A2:E2");
        taskWorksheet.getCell("A2").value = `Description: ${taskData.description}`;
        taskWorksheet.getCell("A2").font = { bold: true };

        taskWorksheet.addRow([]);
        const headerRow = taskWorksheet.addRow(["Task", "Email", "Distance", "Date", "Status", "Comments"]);
        headerRow.font = { bold: true };

        // Track user distances
        const userDistanceMap = {};

        // Add filtered data
        filteredTaskData.forEach((taskItem) => {
            taskItem.filteredTo.forEach((email) => {
                const acceptedByEntry = taskItem.acceptedBy.find(
                    (entry) => entry.employeeEmail === email.value
                );

                const distance = acceptedByEntry?.punchObjectId?.distance
                    ? Number(acceptedByEntry.punchObjectId.distance).toFixed(3)
                    : "";

                // Update user-wise total distances
                if (distance) {
                    if (!userDistanceMap[email.label]) userDistanceMap[email.label] = 0;
                    userDistanceMap[email.label] += Number(distance);
                }

                taskWorksheet.addRow([
                    taskItem.taskName,
                    email.label,
                    distance || "",
                    acceptedByEntry?.punchObjectId?.createdAt
                        ? format(new Date(acceptedByEntry.punchObjectId.createdAt), "PP")
                        : "-",
                    acceptedByEntry?.status || "Assigned",
                    acceptedByEntry?.comments || "",
                ]);
            });
        });

        // Add summary worksheet
        const summaryWorksheet = workbook.addWorksheet("User-Wise Totals");
        summaryWorksheet.mergeCells("A1:B1");
        summaryWorksheet.getCell("A1").value = "User-Wise Total Distances";
        summaryWorksheet.getCell("A1").font = { bold: true };
        summaryWorksheet.addRow(["Email", "Total Distance"]).font = { bold: true };

        Object.entries(userDistanceMap).forEach(([email, totalDistance]) => {
            summaryWorksheet.addRow([email, totalDistance.toFixed(3)]);
        });

        // Generate Excel
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "filtered_task_data.xlsx";
            link.click();
            window.URL.revokeObjectURL(url);
        });
    };

    const filteredTaskData = taskData.taskName.map((taskItem) => {
        const filteredTo = taskData.to.filter((email) => {
            const acceptedByEntry = taskItem.acceptedBy.find(
                (entry) => entry.employeeEmail === email.value
            );

            if (!acceptedByEntry?.punchObjectId?.createdAt) return false;

            const date = new Date(acceptedByEntry.punchObjectId.createdAt);

            const yearMatches = selectedYear ? date.getFullYear() === Number(selectedYear) : true;
            const monthMatches = selectedMonth ? date.getMonth() + 1 === Number(selectedMonth) : true;

            return yearMatches && monthMatches;
        });

        return { ...taskItem, filteredTo };
    });

    // If no filter is selected, return all data (default behavior)
    const allData = taskData.taskName.map((taskItem) => ({
        ...taskItem,
        filteredTo: taskData.to
    }));

    const tasksToDisplay = selectedYear || selectedMonth ? filteredTaskData : allData;


    return (
        <div className="overflow-auto">
            <div>
                <h2 className="text-2xl mb-2">{taskData?.title}</h2>
                <p className="text-sm text-muted-foreground">{taskData?.description}</p>
                <br />
            </div>

            <div className="flex gap-4 mb-4">
                {/* Year Filter */}
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border px-2 py-1"
                >
                    <option value="">All Years</option>
                    {Array.from({ length: 30 }, (_, i) => 2001 + i).map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                {/* Month Filter */}
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border px-2 py-1"
                >
                    <option value="">All Months</option>
                    {[
                        "January", "February", "March", "April", "May",
                        "June", "July", "August", "September", "October",
                        "November", "December"
                    ].map((month, index) => (
                        <option key={index} value={index + 1}>{month}</option>
                    ))}
                </select>
            </div>


            <table className="w-full table-auto border border-collapse min-w-full bg-white text-left !text-sm font-light">
                <thead className="border-b bg-gray-100 font-bold">
                    <tr className="!font-semibold">
                        <th className="py-3 text-sm px-2">Task</th>
                        <th className="py-3 text-sm px-2">Email</th>
                        <th className="py-3 text-sm px-2">Distance</th>
                        <th className="py-3 text-sm px-2">Date</th>
                        <th className="py-3 text-sm px-2">Status</th>
                        <th className="py-3 text-sm px-2">Comments</th>
                    </tr>
                </thead>
                <tbody>
                    {tasksToDisplay.map((taskItem) =>
                        taskItem.filteredTo.map((email) => {
                            const acceptedByEntry = taskItem.acceptedBy.find(
                                (entry) => entry.employeeEmail === email.value
                            );
                            return (
                                <tr className="border-b" key={`${taskItem._id}-${email.value}`}>
                                    <td className="py-3 px-2">{taskItem.taskName}</td>
                                    <td className="py-3 px-2">{email.label}</td>
                                    <td className="py-3 px-2">
                                        {acceptedByEntry?.punchObjectId?.distance
                                            ? Number(acceptedByEntry.punchObjectId.distance).toFixed(3)
                                            : ""}
                                    </td>
                                    <td className="py-3 px-2">
                                        {acceptedByEntry?.punchObjectId?.createdAt
                                            ? format(new Date(acceptedByEntry.punchObjectId.createdAt), "PP")
                                            : "-"}
                                    </td>
                                    <td className="py-3 px-2">
                                        {acceptedByEntry
                                            ? acceptedByEntry.status
                                                ? acceptedByEntry.status === "Completed"
                                                    ? <Button
                                                        sx={{ textTransform: "none" }}
                                                        onClick={() => handleComplete(email.value, acceptedByEntry?.punchObjectId)}
                                                    >
                                                        Completed
                                                    </Button>
                                                    : acceptedByEntry.status
                                                : acceptedByEntry.accepted
                                                    ? "Accept"
                                                    : "Reject"
                                            : "Assigned"}
                                    </td>
                                    <td className="py-3 px-2">
                                        {acceptedByEntry?.comments || ""}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>



            </table>
            <br />
            <div className="flex justify-end">
                <Button variant="contained" onClick={generateExcel}>Download Excel</Button>
            </div>
        </div>
    );
};

export default ModalForStatusShow;
