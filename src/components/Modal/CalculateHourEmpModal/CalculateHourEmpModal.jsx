// import React, { useContext, useState, useEffect } from "react";
// import {
//   Container,
//   Dialog,
//   DialogContent,
//   Typography,
//   Grid,
//   IconButton,
//   DialogActions,
//   Button,
// } from "@mui/material";
// import { Close } from "@mui/icons-material";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { TestContext } from "../../../State/Function/Main";
// import useHourHook from "../../../hooks/useHoursHook/useHourHook";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import AuthInputFiled from "../../InputFileds/AuthInputFiled";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useQuery } from "react-query";

// const CalculateHourEmpModal = ({
//   handleClose,
//   open,
//   empPunchingData,
//   organisationId,
// }) => {
//   // to define the state, hook and other function if needed
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const [remarks, setRemarks] = useState("");
//   const { handleAlert } = useContext(TestContext);
//   const { justify, leave, shift } = useHourHook();
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const totalPages = Math.ceil(
//     empPunchingData?.punchingRecords?.length / itemsPerPage
//   );
//   const navigate = useNavigate("");
//   console.log("empPunchingData", empPunchingData);

//   // to define the schema for validation
//   const CalculateHourSchemas = z.object({
//     hour: z.string().refine(
//       (value) => {
//         // Updated regex to allow numbers between 0 and 24 with optional decimal points
//         const regex = /^(0*(?:[0-9]|1[0-9]|2[0-4]))(\.\d{1,2})?$/;
//         return regex.test(value);
//       },
//       {
//         message:
//           "Hour must be a valid number between 0 and 24, with up to two decimal places.",
//       }
//     ),
//     timeRange: z
//       .object({
//         startDate: z.string().optional(),
//         endDate: z.string().optional(),
//       })
//       .optional(),
//   });

//   const { control, formState, getValues, setError, reset } = useForm({
//     resolver: zodResolver(CalculateHourSchemas),
//   });
//   const { errors } = formState;

//   useEffect(() => {
//     const data = getValues();
//     console.log("form data", data);
//   }, [getValues]);

//   // Pagination functions
//   const getPaginationButtons = (currentPage, totalPages) => {
//     const buttons = [];
//     const maxButtons = 5;
//     const half = Math.floor(maxButtons / 2);

//     let startPage = Math.max(1, currentPage - half);
//     let endPage = Math.min(totalPages, currentPage + half);

//     if (currentPage <= half) {
//       endPage = Math.min(maxButtons, totalPages);
//     } else if (currentPage + half >= totalPages) {
//       startPage = Math.max(totalPages - maxButtons + 1, 1);
//     }

//     if (startPage > 1) {
//       buttons.push(1);
//       if (startPage > 2) {
//         buttons.push("...");
//       }
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       buttons.push(i);
//     }

//     if (endPage < totalPages) {
//       if (endPage < totalPages - 1) {
//         buttons.push("...");
//       }
//       buttons.push(totalPages);
//     }

//     return buttons;
//   };

//   const prePage = () => {
//     setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
//   };

//   const nextPage = () => {
//     setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
//   };

//   const changePage = (pageNumber) => {
//     if (pageNumber !== "..." && pageNumber !== currentPage) {
//       setCurrentPage(pageNumber);
//     }
//   };
//   const paginationButtons = getPaginationButtons(currentPage, totalPages);

//   // Get Query for fetching weekend in the organization
//   const { data: getWeekend } = useQuery(
//     ["getWeekend", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/weekend/get/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data;
//     }
//   );
//   let weekendDays =
//     getWeekend && getWeekend.days && getWeekend.days.length > 0
//       ? getWeekend.days[0].days.map((dayObj) => dayObj.day)
//       : [];
//   // Get Query for fetching overtime in the organization
//   const { data: overtime } = useQuery(
//     ["overtime", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/get/${organisationId}/overtime`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data;
//     }
//   );
//   let isOvertimeAllowanceEnabled =
//     overtime && overtime?.overtimeAllowanceRequired;
//   let overTimeHourByOrg = overtime && overtime?.minimumOvertimeHours;
//   console.log("overTimeHourByOrg", overTimeHourByOrg);
//   console.log("isOvertimeAllowanceEnabled", isOvertimeAllowanceEnabled);

//   //  calculate hour
//   const handleCalculateHours = async () => {
//     const data = getValues();
//     const { hour, timeRange } = data;
//     const regex = /^(0*(?:[0-9]|1[0-9]|2[0-4]))(\.\d{1,2})?$/;

//     // Validate and convert `hour` to number
//     const parsedHour = parseFloat(hour);
//     if (isNaN(parsedHour) || !regex.test(hour)) {
//       setError("hour", { type: "custom", message: "hour should be 0 to 24" });
//       return;
//     } else {
//       setError("hour", null);
//     }

//     if (!timeRange?.startDate || !timeRange?.endDate) {
//       setError("timeRange", {
//         type: "custom",
//         message: "Please select a valid date range.",
//       });
//       return;
//     } else {
//       setError("timeRange", null);
//     }

//     // Convert and validate `overTimeHour`
//     const parsedOverTimeHour = parseFloat(overTimeHourByOrg);
//     console.log("overtimeHours", parsedOverTimeHour);

//     const startDate = new Date(timeRange.startDate);
//     const endDate = new Date(timeRange.endDate);

//     console.log("startDate ", startDate);
//     console.log("endDate", endDate);

//     // Ensure endDate is inclusive
//     endDate.setDate(endDate.getDate() + 1);

//     const punchingRecords = empPunchingData?.punchingRecords || [];
//     // Filter and organize records
//     const filteredRecords = {};

//     punchingRecords.forEach((record) => {
//       const recordDate = new Date(record.date);
//       if (recordDate >= startDate && recordDate < endDate) {
//         const date = recordDate.toISOString().split("T")[0];
//         const dayOfWeek = recordDate.toLocaleString("en-US", {
//           weekday: "short",
//         });

//         if (!filteredRecords[date]) {
//           filteredRecords[date] = { checkIn: null, checkOut: null, dayOfWeek };
//         }
//         if (record.punchingStatus === "Check In") {
//           if (
//             !filteredRecords[date].checkIn ||
//             record.punchingTime < filteredRecords[date].checkIn.punchingTime
//           ) {
//             filteredRecords[date].checkIn = record;
//           }
//         } else if (record.punchingStatus === "Check Out") {
//           if (
//             !filteredRecords[date].checkOut ||
//             record.punchingTime > filteredRecords[date].checkOut.punchingTime
//           ) {
//             filteredRecords[date].checkOut = record;
//           }
//         }
//       }
//     });

//     console.log("filteredRecords", filteredRecords);

//     // Iterate over each date within the selected time range
//     for (
//       let currentDate = new Date(startDate);
//       currentDate < endDate;
//       currentDate.setDate(currentDate.getDate() + 1)
//     ) {
//       const date = currentDate.toISOString().split("T")[0];
//       const dayOfWeek = currentDate.toLocaleString("en-US", {
//         weekday: "short",
//       });
//       const record = filteredRecords[date] || {};

//       let totalHours = 0;
//       let overTimeHours = 0;
//       let remarks = "";

//       // Skip calculation if it's a weekend and no checkIn or checkOut records exist
//       if (
//         weekendDays.includes(dayOfWeek) &&
//         (!record.checkIn || !record.checkOut)
//       ) {
//         continue;
//       }

//       if (record.checkIn && record.checkOut) {
//         const punchInTime = new Date(
//           `1970-01-01T${record.checkIn.punchingTime}`
//         );
//         const punchOutTime = new Date(
//           `1970-01-01T${record.checkOut.punchingTime}`
//         );

//         const timeDiff = punchOutTime - punchInTime;
//         totalHours = Math.max(0, timeDiff / (1000 * 60 * 60));

//         // Calculate overtime hours
//         if (totalHours > parsedHour) {
//           overTimeHours = totalHours - parsedHour;
//         }
//       } else if (!weekendDays.includes(dayOfWeek)) {
//         totalHours = 0;
//       }
//       const formattedOverTimeHours = parseFloat(overTimeHours.toFixed(2)); // Number
//       console.log("formattedOverTimeHours", formattedOverTimeHours);

//       const formattedTotalHours = Math.floor(totalHours);
//       const formattedMinutes = Math.round(
//         (totalHours - formattedTotalHours) * 60
//       );

//       let totalHour = `${formattedTotalHours} hr`;
//       if (formattedMinutes > 0) {
//         totalHour += ` ${formattedMinutes} min`;
//       }

//       if (weekendDays.includes(dayOfWeek)) {
//         remarks = "ExtraShift";
//       } else if (
//         isOvertimeAllowanceEnabled &&
//         totalHours >= parsedHour + parsedOverTimeHour
//       ) {
//         remarks = "Overtime";
//       } else if (totalHours >= parsedHour) {
//         remarks = "Available";
//       } else if (totalHours > 0) {
//         remarks = "Partial";
//       } else {
//         remarks = "Unavailable";
//       }

//       setRemarks(remarks);

//       const postData = {
//         EmployeeId: empPunchingData?.EmployeeId._id,
//         organizationId: organisationId,
//         recordDate: date,
//         punchInTime: record.checkIn
//           ? new Date(`1970-01-01T${record.checkIn.punchingTime}`).toISOString()
//           : null,
//         punchOutTime: record.checkOut
//           ? new Date(`1970-01-01T${record.checkOut.punchingTime}`).toISOString()
//           : null,
//         totalHours: totalHour,
//         status: remarks,
//         overtimeHours: formattedOverTimeHours,
//         justify: justify,
//         leave: leave,
//         shift: shift,
//       };
//       console.log("post data", postData);
//       try {
//         const response = await fetch(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/punching-data`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: authToken,
//             },
//             body: JSON.stringify(postData),
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to calculate hours.");
//         }

//         const responseData = await response.json();
//         console.log(responseData);
//         handleClose();
//         handleAlert(true, "success", "Hours calculated successfully.");
//         reset();
//         navigate(`/organisation/${organisationId}/view-calculate-data`);
//       } catch (error) {
//         console.error("Error calculating hours:", error);
//         handleAlert(
//           false,
//           "error",
//           `Failed to calculate hours. Please try again. ${error.message}`
//         );
//       }
//     }
//   };
//   console.log(remarks);

//   return (
//     <Dialog
//       PaperProps={{
//         sx: {
//           width: "100%",
//           maxWidth: "1000px!important",
//         },
//       }}
//       open={open}
//       onClose={handleClose}
//       className="w-full"
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
//         <Container maxWidth="xl" className="bg-gray-50">
//           <Grid
//             container
//             alignItems="center"
//             justifyContent="space-between"
//             className="mt-5 mb-5"
//           >
//             <Grid item>
//               <Typography variant="h6" className="mb-6 mt-4">
//                 Calculating working hours:
//               </Typography>
//               <Typography variant="h7" className="mb-6 mt-4">
//                 Employee Name: {`${empPunchingData?.EmployeeId?.first_name}`}{" "}
//                 {`${empPunchingData?.EmployeeId?.last_name}`}
//               </Typography>
//               <br></br>
//               <Typography variant="h7" className="mb-6 mt-4">
//                 Employee Id: {`${empPunchingData?.EmployeeId?.empId}`}
//               </Typography>
//               <p className="text-xs text-gray-600">
//                 Calculate the working hours of employee.
//               </p>
//             </Grid>
//             <Grid item>
//               <IconButton onClick={handleClose}>
//                 <Close />
//               </IconButton>
//             </Grid>
//           </Grid>
//           <Grid container spacing={2} className="mb-5">
//             <Grid item xs={6}>
//               <AuthInputFiled
//                 name="hour"
//                 icon={AccessTimeIcon}
//                 control={control}
//                 type="number"
//                 placeholder="Total Shift Hour"
//                 label=" Total  Shift Hour *"
//                 errors={errors}
//                 error={errors.hour}
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <AuthInputFiled
//                 name="timeRange"
//                 control={control}
//                 type="calender"
//                 asSingle={false}
//                 placeholder="Select Date Range"
//                 label="Select Date Range *"
//                 readOnly={false}
//                 maxLimit={15}
//                 useRange={true}
//                 errors={errors}
//                 error={errors.timeRange}
//               />
//             </Grid>
//           </Grid>
//           <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
//             <table className="min-w-full bg-white text-left !text-sm font-light">
//               <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//                 <tr className="!font-semibold">
//                   <th scope="col" className="px-6 py-3">
//                     Sr No
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Date
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Punching Time
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Punching Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {empPunchingData?.punchingRecords
//                   .slice(
//                     (currentPage - 1) * itemsPerPage,
//                     currentPage * itemsPerPage
//                   )
//                   .map((record, index) => (
//                     <tr
//                       key={index}
//                       className={`border-b border-neutral-200 bg-neutral-100 ${
//                         index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                       }`}
//                     >
//                       <td className="whitespace-nowrap px-6 py-2 font-medium">
//                         {index + 1 + (currentPage - 1) * itemsPerPage}
//                       </td>
//                       <td className="whitespace-nowrap px-6 py-2">
//                         {new Date(record.date).toLocaleDateString()}
//                       </td>
//                       <td className="whitespace-nowrap px-6 py-2">
//                         {record.punchingTime}
//                       </td>
//                       <td className="whitespace-nowrap px-6 py-2">
//                         {record.punchingStatus}
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {/* Pagination */}
//           <div className="flex items-center justify-center p-4">
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={prePage}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </Button>
//             <div className="mx-4">
//               {paginationButtons.map((btn, index) => (
//                 <Button
//                   key={index}
//                   variant={btn === currentPage ? "contained" : "outlined"}
//                   color="primary"
//                   onClick={() => changePage(btn)}
//                   disabled={btn === "..." || btn === currentPage}
//                 >
//                   {btn}
//                 </Button>
//               ))}
//             </div>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={nextPage}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </Button>
//           </div>
//         </Container>
//       </DialogContent>
//       <DialogActions className="px-4 !py-3 shadow-md outline-none rounded-md bg-gray-50">
//         <Button
//           onClick={handleCalculateHours}
//           variant="contained"
//           className="bg-blue-800 hover:bg-blue-800"
//         >
//           Calculate Hours
//         </Button>
//         <Button color="error" variant="outlined" onClick={handleClose}>
//           Cancel
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CalculateHourEmpModal;
import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Dialog,
  DialogContent,
  Typography,
  Grid,
  IconButton,
  DialogActions,
  Button,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import useHourHook from "../../../hooks/useHoursHook/useHourHook";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";

const CalculateHourEmpModal = ({
  handleClose,
  open,
  empPunchingData,
  organisationId,
}) => {
  // to define the state, hook and other function if needed
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [remarks, setRemarks] = useState("");
  const { handleAlert } = useContext(TestContext);
  const { justify, leave, shift } = useHourHook();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(
    empPunchingData?.punchingRecords?.length / itemsPerPage
  );
  const navigate = useNavigate("");
  console.log("empPunchingData", empPunchingData);

  // to define the schema for validation
  const CalculateHourSchemas = z.object({
    hour: z.string().refine(
      (value) => {
        // Updated regex to allow numbers between 0 and 24 with optional decimal points
        const regex = /^(0*(?:[0-9]|1[0-9]|2[0-4]))(\.\d{1,2})?$/;
        return regex.test(value);
      },
      {
        message:
          "Hour must be a valid number between 0 and 24, with up to two decimal places.",
      }
    ),
    timeRange: z
      .object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
      .optional(),
  });

  const { control, formState, getValues, setError, reset } = useForm({
    resolver: zodResolver(CalculateHourSchemas),
  });
  const { errors } = formState;

  useEffect(() => {
    const data = getValues();
    console.log("form data", data);
  }, [getValues]);

  // Pagination functions
  const getPaginationButtons = (currentPage, totalPages) => {
    const buttons = [];
    const maxButtons = 5;
    const half = Math.floor(maxButtons / 2);

    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      endPage = Math.min(maxButtons, totalPages);
    } else if (currentPage + half >= totalPages) {
      startPage = Math.max(totalPages - maxButtons + 1, 1);
    }

    if (startPage > 1) {
      buttons.push(1);
      if (startPage > 2) {
        buttons.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push("...");
      }
      buttons.push(totalPages);
    }

    return buttons;
  };

  const prePage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const changePage = (pageNumber) => {
    if (pageNumber !== "..." && pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  };
  const paginationButtons = getPaginationButtons(currentPage, totalPages);

  // Get Query for fetching weekend in the organization
  const { data: getWeekend } = useQuery(
    ["getWeekend", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/weekend/get/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    }
  );
  let weekendDays =
    getWeekend && getWeekend.days && getWeekend.days.length > 0
      ? getWeekend.days[0].days.map((dayObj) => dayObj.day)
      : [];
  // Get Query for fetching overtime in the organization
  const { data: overtime } = useQuery(
    ["overtime", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/${organisationId}/overtime`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );
  let isOvertimeAllowanceEnabled =
    overtime && overtime?.overtimeAllowanceRequired;
  let overTimeHour = overtime && overtime?.minimumOvertimeHours;
  console.log("isOvertimeAllowanceEnabled", isOvertimeAllowanceEnabled);
  console.log("overTimeHour", overTimeHour);

  //  calculate hour
  const handleCalculateHours = async () => {
    const data = getValues();
    const { hour, timeRange } = data;
    const regex = /^(0*(?:[0-9]|1[0-9]|2[0-4]))(\.\d{1,2})?$/;

    console.log("timeRange", timeRange);
    console.log("hour", hour);

    // Validate and convert `hour` to number
    const parsedHour = parseFloat(hour);
    if (isNaN(parsedHour) || !regex.test(hour)) {
      setError("hour", { type: "custom", message: "hour should be 0 to 24" });
      return;
    } else {
      setError("hour", null);
    }

    if (!timeRange?.startDate || !timeRange?.endDate) {
      setError("timeRange", {
        type: "custom",
        message: "Please select a valid date range.",
      });
      return;
    } else {
      setError("timeRange", null);
    }

    // Convert and validate `overTimeHour`
    const parsedOverTimeHour = parseFloat(overTimeHour);
    console.log("parsedOverTimeHour", parsedOverTimeHour);

    const startDate = new Date(timeRange.startDate);
    const endDate = new Date(timeRange.endDate);

    console.log("startDate", startDate);
    console.log("endDate", endDate);

    // Ensure endDate is inclusive
    endDate.setDate(endDate.getDate() + 1);
    console.log("endDate with inclusive", endDate);

    const punchingRecords = empPunchingData?.punchingRecords || [];
    console.log("punchingRecords", punchingRecords);

    // Filter and organize records
    const filteredRecords = {};

    punchingRecords.forEach((record) => {
      const recordDate = new Date(record.date);
      if (recordDate >= startDate && recordDate < endDate) {
        const date = recordDate.toISOString().split("T")[0];
        const dayOfWeek = recordDate.toLocaleString("en-US", {
          weekday: "short",
        });

        if (!filteredRecords[date]) {
          filteredRecords[date] = { checkIn: null, checkOut: null, dayOfWeek };
        }
        if (record.punchingStatus === "Check In") {
          if (
            !filteredRecords[date].checkIn ||
            record.punchingTime < filteredRecords[date].checkIn.punchingTime
          ) {
            filteredRecords[date].checkIn = record;
          }
        } else if (record.punchingStatus === "Check Out") {
          if (
            !filteredRecords[date].checkOut ||
            record.punchingTime > filteredRecords[date].checkOut.punchingTime
          ) {
            filteredRecords[date].checkOut = record;
          }
        }
      }
    });

    console.log("filteredRecords", filteredRecords);

    // Iterate over each date within the selected time range
    for (
      let currentDate = new Date(startDate);
      currentDate < endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const date = currentDate.toISOString().split("T")[0];
      const dayOfWeek = currentDate.toLocaleString("en-US", {
        weekday: "short",
      });
      const record = filteredRecords[date] || {};

      let totalHours = 0;
      let overTimeHours = 0;
      let remarks = "";

      // Skip calculation if it's a weekend and no checkIn or checkOut records exist
      if (
        weekendDays.includes(dayOfWeek) &&
        (!record.checkIn || !record.checkOut)
      ) {
        continue;
      }

      if (record.checkIn && record.checkOut) {
        const punchInTime = new Date(
          `1970-01-01T${record.checkIn.punchingTime}`
        );
        const punchOutTime = new Date(
          `1970-01-01T${record.checkOut.punchingTime}`
        );

        const timeDiff = punchOutTime - punchInTime;
        totalHours = Math.max(0, timeDiff / (1000 * 60 * 60));

        // Calculate overtime hours
        if (totalHours > parsedHour) {
          overTimeHours = totalHours - parsedHour;
        }
      } else if (!weekendDays.includes(dayOfWeek)) {
        totalHours = 0;
      }

      const formattedTotalHours = Math.floor(totalHours);
      const formattedMinutes = Math.round(
        (totalHours - formattedTotalHours) * 60
      );

      let totalHour = `${formattedTotalHours} hr`;
      if (formattedMinutes > 0) {
        totalHour += ` ${formattedMinutes} min`;
      }

      const formattedOverTimeHours = parseFloat(overTimeHours.toFixed(2));

      if (weekendDays.includes(dayOfWeek)) {
        remarks = "ExtraShift";
      } else if (
        isOvertimeAllowanceEnabled &&
        totalHours >= parsedHour + parsedOverTimeHour
      ) {
        remarks = "Overtime";
      } else if (totalHours >= parsedHour) {
        remarks = "Available";
      } else if (totalHours > 0) {
        remarks = "Partial";
      } else {
        remarks = "Unavailable";
      }

      setRemarks(remarks);

      const postData = {
        EmployeeId: empPunchingData?.EmployeeId._id,
        organizationId: organisationId,
        recordDate: date,
        punchInTime: record.checkIn
          ? new Date(`1970-01-01T${record.checkIn.punchingTime}`).toISOString()
          : null,
        punchOutTime: record.checkOut
          ? new Date(`1970-01-01T${record.checkOut.punchingTime}`).toISOString()
          : null,
        totalHours: totalHour,
        status: remarks,
        overtimeHours: formattedOverTimeHours,
        justify: justify,
        leave: leave,
        shift: shift,
      };
      console.log("post data", postData);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/punching-data`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
            },
            body: JSON.stringify(postData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to calculate hours.");
        }

        const responseData = await response.json();
        console.log(responseData);
        handleClose();
        handleAlert(true, "success", "Hours calculated successfully.");
        reset();
        navigate(`/organisation/${organisationId}/view-calculate-data`);
      } catch (error) {
        console.error("Error calculating hours:", error);
        handleAlert(
          false,
          "error",
          `Failed to calculate hours. Please try again. ${error.message}`
        );
      }
    }
  };
  console.log(remarks);

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "1000px!important",
        },
      }}
      open={open}
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <Container maxWidth="xl" className="bg-gray-50">
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            className="mt-5 mb-5"
          >
            <Grid item>
              <Typography variant="h6" className="mb-6 mt-4">
                Calculating working hours:
              </Typography>
              <Typography variant="h7" className="mb-6 mt-4">
                Employee Name: {`${empPunchingData?.EmployeeId?.first_name}`}{" "}
                {`${empPunchingData?.EmployeeId?.last_name}`}
              </Typography>
              <br></br>
              <Typography variant="h7" className="mb-6 mt-4">
                Employee Id: {`${empPunchingData?.EmployeeId?.empId}`}
              </Typography>
              <p className="text-xs text-gray-600">
                Calculate the working hours of employee.
              </p>
            </Grid>
            <Grid item>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container spacing={2} className="mb-5">
            <Grid item xs={6}>
              <AuthInputFiled
                name="hour"
                icon={AccessTimeIcon}
                control={control}
                type="number"
                placeholder="Total Shift Hour"
                label=" Total  Shift Hour *"
                errors={errors}
                error={errors.hour}
              />
            </Grid>
            <Grid item xs={6}>
              <AuthInputFiled
                name="timeRange"
                control={control}
                type="calender"
                asSingle={false}
                placeholder="Select Date Range"
                label="Select Date Range *"
                readOnly={false}
                maxLimit={15}
                useRange={true}
                errors={errors}
                error={errors.timeRange}
              />
            </Grid>
          </Grid>
          <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
            <table className="min-w-full bg-white text-left !text-sm font-light">
              <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                <tr className="!font-semibold">
                  <th scope="col" className="px-6 py-3">
                    Sr No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Punching Time
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Punching Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {empPunchingData?.punchingRecords
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((record, index) => (
                    <tr
                      key={index}
                      className={`border-b border-neutral-200 bg-neutral-100 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="whitespace-nowrap px-6 py-2 font-medium">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </td>
                      <td className="whitespace-nowrap px-6 py-2">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-2">
                        {record.punchingTime}
                      </td>
                      <td className="whitespace-nowrap px-6 py-2">
                        {record.punchingStatus}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {/* Pagination */}
          <div className="flex items-center justify-center p-4">
            <Button
              variant="contained"
              color="primary"
              onClick={prePage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="mx-4">
              {paginationButtons.map((btn, index) => (
                <Button
                  key={index}
                  variant={btn === currentPage ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => changePage(btn)}
                  disabled={btn === "..." || btn === currentPage}
                >
                  {btn}
                </Button>
              ))}
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </Container>
      </DialogContent>
      <DialogActions className="px-4 !py-3 shadow-md outline-none rounded-md bg-gray-50">
        <Button
          onClick={handleCalculateHours}
          variant="contained"
          className="bg-blue-800 hover:bg-blue-800"
        >
          Calculate Hours
        </Button>
        <Button color="error" variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalculateHourEmpModal;
