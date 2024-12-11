// //Updated Code 
// import Alert from "@mui/material/Alert";
// import axios from "axios"; 
// import dayjs from "dayjs";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import React, { useContext, useEffect, useState } from "react";
// import { UseContext } from "../../State/UseState/UseContext";
// import UserProfile from "../../hooks/UserData/useUser";
// import { CircularProgress, Tooltip, Modal, Box } from "@mui/material";
// import { useMediaQuery } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faDownload } from "@fortawesome/free-solid-svg-icons";
// import HeaderComponentPro from "../../components/header/HeaderComponentPro";
// import IconButton from '@mui/material/IconButton';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import CloseIcon from '@mui/icons-material/Close';

// const formatAddress = (address) => {
//   if (!address) return "";

//   const words = address.split(" ");
//   let formattedAddress = "";
//   for (let i = 0; i < words.length; i++) {
//     formattedAddress += words[i] + " ";
//     if ((i + 1) % 6 === 0 && i !== words.length - 1) {
//       formattedAddress += "\n";
//     }
//   }

//   return formattedAddress.trim();
// };

// const ViewPayslip = () => {
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const employeeId = user._id;
//   const organisationId = user.organizationId;
//   const currentDate = dayjs();
//   const [selectedDate, setSelectedDate] = useState(currentDate);
//   const [employeeInfo, setEmployeeInfo] = useState("");
//   const [organisationInfo, setOrganisationInfo] = useState("");
//   const [salaryInfo, setSalaryInfo] = useState([]);
  
//   const [loading, setLoading] = useState(true);
//   // const [open, setOpen] = useState(false);
//   const [modalContent, setModalContent] = useState("");
  

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   const handleDateChange = (event) => {
//     setSelectedDate(dayjs(event.target.value));
//   };

//   const monthFromSelectedDate = selectedDate.format("M");
//   const yearFromSelectedDate = selectedDate.format("YYYY");

//   //😋
  

//   const fetchEmployeeData = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/employeeSalary/viewpayslip/${employeeId}/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//         // responsivness add into Table , annual salary calculations part remaining  in Table
//       );
//       setEmployeeInfo(response.data.employeeInfo);
//       setOrganisationInfo(response.data.organizationInfo);
//       setSalaryInfo(response.data.salaryDetails);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmployeeData();
//   }, []);

//   const pulseAnimation = {
//     animation: "pulse 1.5s infinite",
//   };
//   const filteredSalaryInfo = salaryInfo.find((info) => {
//     return (
//       info.month === parseInt(monthFromSelectedDate) &&
//       info.year === parseInt(yearFromSelectedDate)
//     );
//   });
//   console.log("filtersalaryinfo", filteredSalaryInfo);

//   const exportPDF = async () => {
//     const input = document.getElementById("App");
//     html2canvas(input, {
//       logging: true,
//       letterRendering: 1,
//       useCORS: true,
//     }).then(async (canvas) => {
//       let img = new Image();
//       img.src = canvas.toDataURL("image/png");
//       img.onload = function () {
//         const pdf = new jsPDF("landscape", "mm", "a4");
//         pdf.addImage(
//           img,
//           0,
//           0,
//           pdf.internal.pageSize.width,
//           pdf.internal.pageSize.height
//         );
//         pdf.save("payslip.pdf");
//       };
//     });
//   };

//   // eslint-disable-next-line no-unused-vars
//   // const handleOpenModal = (content) => {
//   //   setModalContent(content);
//   //   setOpen(true);
//   // };

//   // const handleCloseModal = () => setOpen(false);

//   const [open, setOpen] = useState(false);

//   const handleOpenModal = () => setOpen(true);
//   const handleCloseModal = () => setOpen(false);

//   return (
//     <>
//     <section className="pt-1">
//         <HeaderComponentPro
//           heading={"Payslip"}
//           oneLineInfo={
//             "Complete overview of your earnings and deductions"
//           } 
//           />

//       {/* Left */}
//       {/* <div className="container mx-auto p-6">
//         <div className="flex items-center justify-center mb-6">
//           <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 w-full max-w-md">
//            <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">
//               Select the month for your Payslip Statement
//             </h3>
//             <input
//               type="month"
//               value={selectedDate.format("YYYY-MM")}
//               onChange={handleDateChange}
//               className="border border-gray-300 rounded-lg p-3 text-gray-700 w-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
//               placeholder="Select Month"
//             />
//           </div>
//         </div>
//       </div>
//      */}
//        {/* Right > Button to Show Modal */}
//        {/* <div className="flex justify-center mt-4">
//         <button
//           onClick={handleOpenModal}
//           className="px-6 py-2 rounded-lg bg-green-600 text-white text-lg font-semibold shadow-md hover:bg-green-700 transition duration-200 flex items-center justify-center"
//         >
//           View Payslip
//         </button>
//       </div>  */}

//        {/* <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
//       <div className="flex w-full max-w-6xl bg-white shadow-md border border-gray-300">
        
//         <div className="w-1/2 p-6">
//           <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-1">
//             <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">
//               Select the month for your Payslip Statement
//             </h3>
//             <input
//               type="month"
//               value={selectedDate.format("YYYY-MM")}
//               onChange={handleDateChange}
//               className="border border-gray-300 rounded-lg p-3 text-gray-700 w-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
//               placeholder="Select Month"
//             />
//           </div>
//         </div>

  
//         <div className="w-1/2 flex justify-center items-center p-6">
//           <button
//             onClick={handleOpenModal}
//             className="px-6 py-2 rounded-lg bg-green-600 text-white text-lg font-semibold shadow-md hover:bg-green-700 transition duration-200 flex items-center justify-center"
//           >
//             View Payslip
//           </button>
//         </div>
//       </div>
//       </div> */}
//       <br />

// <div className="flex justify-center   p-6">
//   <div className="flex w-full max-w-6xl  bg-gradient-to-r from-gray-100 to-gray-50 shadow-lg border border-gray-300 rounded-lg">
//     {/* Left */}
//     <div className="w-[60%] p-6">
//       <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
//         <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">
//           Select the month for your Payslip Statement
//         </h3>
//         <input
//           type="month"
//           value={selectedDate.format("YYYY-MM")}
//           onChange={handleDateChange}
//           className="border border-gray-300 rounded-lg p-3 text-gray-700 w-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
//           placeholder="Select Month"
//         />
//       </div>
//     </div>

//     {/* Right > Button to Show Modal */}
//     <div className="w-[40%] flex justify-center items-center p-4">
//       <button
//         onClick={handleOpenModal}
//         className="px-6 py-3 rounded-lg bg-blue-500 text-white text-lg font-semibold shadow-md hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 flex items-center justify-center"
//       >
//          <VisibilityIcon className="mr-2" />
//         View Payslip
//       </button>
//     </div>
//   </div>
// </div>

//       {/* Modal */}
//       <Modal
//         open={open}
//         onClose={handleCloseModal}
//         aria-labelledby="modal-title"
//         aria-describedby="modal-description"
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: '80%',
//             bgcolor: "background.paper",
//             border: "2px solid #000",
//             boxShadow: 24,
//             p: 4,
//             borderRadius: 2,
//             maxHeight: '80vh',
//             overflowY: 'auto',
            
//           }}
//         >
//            <IconButton
//           onClick={handleCloseModal}
//           aria-label="close"
//           sx={{
//             position: 'absolute',
//             top: 8,
//             right: 8,
//             color: 'text.danger'
//           }}
//         >
//           <CloseIcon />
//         </IconButton>


//           <div className="container mx-auto  bg-white w-full max-w-full">
    
// {/* ______________________ */}
//       {/* Bottom part */} 
   
//       <div className="container mx-auto p-4 !bg-white  w-4/5 max-w-full">
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <CircularProgress />
//           </div>
//         ) : employeeInfo && organisationInfo ? (
//           // main
//           <div className="!bg-white shadow-lg rounded-lg p-6 border border-gray-300">
//             <div id="App" className="p-7">
//               <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-6 border-b pb-4">
//                 <img
//                   src={organisationInfo?.logo_url}
//                   alt={organisationInfo?.orgName}
//                   className="w-24 h-24 rounded-full border border-gray-300 shadow-md"
//                 />
//                 {/* <div className="mt-4 md:mt-0 md:ml-4 text-center md:text-left">
//                   <p className="text-xl font-semibold text-gray-800">
//                     Organisation:{" "}
//                     <span className="font-normal">
//                       {organisationInfo?.orgName}
//                     </span>
//                   </p>
//                   <p className="text-lg text-gray-600">
//                     Address:{" "}
//                     <span className="font-normal">
//                       {organisationInfo?.location?.address}
//                     </span>
//                   </p>
//                   <p className="text-lg text-gray-600">
//                     Contact No:{" "}
//                     <span className="font-normal">
//                       {organisationInfo?.contact_number}
//                     </span>
//                   </p>
//                   <p className="text-lg text-gray-600">
//                     Email:{" "}
//                     <span className="font-normal">
//                       {organisationInfo?.email}
//                     </span>
//                   </p>
//                 </div> */}
//                 <div className="mt-4 md:mt-0 md:ml-4 text-center md:text-left">
//                   <p className="text-xl font-semibold text-gray-800">
//                     Organisation:{" "}
//                     <span className="font-normal">
//                       {organisationInfo?.orgName}
//                     </span>
//                   </p>
//                   <p className="text-lg text-gray-600 whitespace-pre-wrap">
//                     Address:{" "}
//                     <span className="font-normal">
//                       {formatAddress(organisationInfo?.location?.address)}
//                     </span>
//                   </p>
//                   <p className="text-lg text-gray-600">
//                     Contact No:{" "}
//                     <span className="font-normal">
//                       {organisationInfo?.contact_number}
//                     </span>
//                   </p>
//                   <p className="text-lg text-gray-600">
//                     Email:{" "}
//                     <span className="font-normal">
//                       {organisationInfo?.email}
//                     </span>
//                   </p>
//                 </div>
//               </div>

//               {/* First Table */}
//               <div className="mb-6 overflow-x-auto">
//                 <div className=" m-1  flex justify-center items-center h-full">
//                   <h1 className="text-center text-gray-700 font-extrabold text-2xl font-mono py-2 pb-2">
//                     Salary Slip
//                   </h1>
//                 </div>

//                 <table className="w-full border border-gray-300 border-collapse">
//                   <thead className="bg-blue-100 text-gray-800">
//                     <tr>
//                       <th colSpan={2} className="px-4 py-2 border">
//                         Employee Details
//                       </th>
//                       {/* <th className="border"></th> */}
//                       <th colSpan={2} className="px-4 py-2 border">
//                         Month:
//                         {/* <th className="px-4 py-2 border"> */}
//                         <span className="pl-1">
//                           {" "}
//                           {filteredSalaryInfo?.formattedDate || ""}
//                         </span>
//                       </th>
//                       {/* <th className="px-4 py-2 border"></th> */}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td className="px-4 py-2 border text-gray-700 font-bold ">
//                         Employee Name:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700 font-bold">
//                         {`${employeeInfo?.first_name} ${employeeInfo?.last_name}`}
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         Date Of Joining:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.joining_date
//                           ? new Date(
//                               employeeInfo.joining_date
//                             ).toLocaleDateString("en-GB")
//                           : ""}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="px-4 py-2 border text-gray-700">
//                         Employee Id:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.empId || ""}
//                       </td>
//                       {/* <td className="px-4 py-2 border text-gray-700">
//                         Designation:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.designation?.[0]?.designationName || ""}
//                       </td> */}

//                       {/* <td className="px-4 py-2 border text-gray-700">
//                         Unpaid Leaves:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.unPaidLeaveDays ?? "0"}
//                       </td> */}
//                       <td className="px-4 py-2 border text-gray-700">
//                         No of Days in Month:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.numDaysInMonth ?? "0"}
//                       </td>
//                     </tr>
//                     <tr>
//                       {/* 3 */}
//                       <td className="px-4 py-2 border text-gray-700">
//                         Designation:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.designation?.[0]?.designationName || ""}
//                       </td>

//                       <td className="px-4 py-2 border text-gray-700">
//                         Unpaid Leaves:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.unPaidLeaveDays ?? "0"}
//                       </td>
//                     </tr>

//                     <tr>
//                       {/* 4 */}
//                       <td className="px-4 py-2 border text-gray-700">
//                         Department Name:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.deptname?.[0]?.departmentName || ""}
//                       </td>
//                       {/* 5 */}
//                       {/* <td className="px-4 py-2 border text-gray-700">
//                         PAN No:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.pan_card_number}
//                       </td>
//                        */}

//                       <td className="px-4 py-2 border text-gray-700">
//                         No of Working Days Attended:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.noOfDaysEmployeePresent || ""}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="px-4 py-2 border text-gray-700">
//                         Bank Account No:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.bank_account_no || ""}
//                       </td>

//                       <td className="px-4 py-2 border text-gray-700">
//                         Paid Leaves:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.paidLeaveDays ?? "0"}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="px-4 py-2 border text-gray-700">
//                         PAN No:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.pan_card_number}
//                       </td>

//                       <td className="px-4 py-2 border text-gray-700">
//                         Public Holidays:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.publicHolidaysCount ?? "0"}
//                       </td>

//                       {/* <td className="px-4 py-2 border text-gray-700">
//                         Unpaid Leaves:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.unPaidLeaveDays ?? "0"}
//                       </td> */}
//                     </tr>
//                     <tr>
//                       <td className="px-4 py-2 border text-gray-700">
//                         Aadhar No:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {/* {employeeInfo?.empId || ""} */} NA
//                       </td>

//                       <td className="px-4 py-2 border text-gray-700">PF No:</td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {/* {filteredSalaryInfo?.unPaidLeaveDays ?? "0"} */} NA
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {/* Aadhar No: */}-
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {/* {employeeInfo?.empId || ""} */} -
//                       </td>

//                       <td className="px-4 py-2 border text-gray-700">
//                         ESIC No:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {/* {filteredSalaryInfo?.unPaidLeaveDays ?? "0"} */} NA
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>

//               {/* Income and Deduction Table */}
//               <div className="mb-6 overflow-x-auto">
//                 <table className="w-full border border-gray-300 border-collapse">
//                   <thead className="bg-gray-300 text-gray-800">
//                     <tr>
//                       {/* Monthly */}
//                       <th colSpan={2} className=" px-4 py-2 border">
//                         Monthly Salary
//                       </th>
//                       <th colSpan={2} className="px-4 py-2 border">
//                         Annual Salary
//                       </th>
//                       {/* Yearly */}
//                       {/* <th className=" px-4 py-2 border">Income</th>
//                       <th className="px-4 py-2 border">Deduction</th> */}
//                     </tr>
//                   </thead>
//                   <thead className="bg-gray-50 text-gray-800">
//                     <tr>
//                       {/* Monthly */}
//                       <th className=" px-4 py-2 border border-gray-300">
//                         Income
//                       </th>
//                       <th className="px-4 py-2 border border-gray-300">
//                         Deduction
//                       </th>

//                       {/* Yearly */}
//                       <th className=" px-4 py-2 border">Income</th>
//                       <th className="px-4 py-2 border">Deduction</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {" "}
//                         Particulars{" "}
//                       </td>
//                       <td className="py-2 border text-gray-700">Amount</td>
//                       <td className="py-2 border text-gray-700">Particulars</td>
//                       <td className="py-2 border text-gray-700">Amount</td>
//                     </tr>

//                     {Array.from({
//                       length: Math.max(
//                         filteredSalaryInfo?.income?.length || 0,
//                         filteredSalaryInfo?.deductions?.length || 0
//                       ),
//                     }).map((_, index) => (
//                       <tr key={index}>
//                         <td className="px-4 py-2 border text-gray-700">
//                           {filteredSalaryInfo?.income?.[index]?.name || ""}
//                         </td>
//                         <td className="px-4 py-2 border text-gray-700">
//                           {filteredSalaryInfo?.income?.[index]?.value || ""}
//                         </td>
//                         <td className="px-4 py-2 border text-gray-700">
//                           {filteredSalaryInfo?.deductions?.[index]?.name || ""}
//                         </td>
//                         <td className="px-4 py-2 border text-gray-700">
//                           {filteredSalaryInfo?.deductions?.[index]?.value || ""}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

         

//               {/* Totals */}
//               {/* <div className="mb-6 overflow-x-auto">
//                 <table className="w-full border border-gray-300 border-collapse">
//                   <thead className="bg-blue-100 text-gray-800">
//                     <tr>
//                       <td   className=" px-4 py-2 border">Total Gross Salary:</td>
//                       <td  className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.totalGrossSalary || ""}
//                       </td>
//                       <td   className="px-4 py-2 border">Total Deduction:</td>
//                       <td   className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.totalDeduction || ""}
//                       </td>
//                     </tr>

                    
//                   </thead>
//                 </table>
//               </div> */}

//               {/* Newly added */}

//               <div className="mb-6 overflow-x-auto">
//                 <table className="w-full mt-6 border border-gray-300 border-collapse">
//                   <thead className=" text-gray-800">
//                     <tr className="bg-blue-100">
//                       <th className=" border">Day's in Months</th>
//                       <th className=" border">Arres Days</th>
//                       <th className=" border">LOPR Days</th>
//                       <th className=" border">Worked Days</th>
//                       <th className=" border">Net Day's Worked</th>
//                     </tr>
//                     <tr className="border border-gray-300">
//                       <td className="px-4 py-2  text-gray-700 text-center  border border-gray-300">
//                         {filteredSalaryInfo?.numDaysInMonth ?? "0"}
//                       </td>
//                       <td className="px-4 py-2  text-gray-700 text-center  border border-gray-300 ">
//                         -
//                       </td>
//                       <td className="px-4 py-2  text-gray-700 text-center  border border-gray-300 ">
//                         {filteredSalaryInfo?.unPaidLeaveDays ?? "0"}
//                       </td>

//                       <td className="px-4 py-2  text-gray-700 text-center  border border-gray-300 ">
//                         {filteredSalaryInfo?.noOfDaysEmployeePresent || ""}
//                       </td>
//                       <td className="px-4 py-2  text-gray-700 text-center border border-gray-300  ">
//                         -
//                       </td>
//                     </tr>
//                   </thead>
//                 </table>
//               </div>

//               <div className="mb-6 overflow-x-auto">
//                 <table className="w-full mt-6 border border-gray-300 border-collapse">
//                   <thead className="bg-gray-300 text-gray-800">
//                     <tr>
//                       <th className="  px-4 py-2 border border-gray-300">
//                         Total Net Salary
//                       </th>

//                       <th className="px-4 py-2 border border-gray-300 text-gray-700">
//                         {filteredSalaryInfo?.totalNetSalary || ""}
//                       </th>
//                     </tr>
//                   </thead>
//                 </table>

//                 <div className="p-4">
//                   <h1 className="text-base md:text-base lg:text-base xl:text-base 2xl:text-base leading-tight text-center">
//                     This is computer generated copy hence signature and stamp
//                     not required For   <span>
//                       {organisationInfo?.orgName}
//                     </span>
//                   </h1>
//                 </div>
//               </div>
//             </div>

//             {/* Download Button */}
//             <div className="flex justify-center mt-4">
//               <Tooltip title="Download your payslip as a PDF" arrow>
//                 <button
//                   onClick={exportPDF}
//                   className="relative px-6 py-2 rounded-lg bg-blue-600 text-white text-lg font-semibold shadow-md hover:bg-blue-700 transition duration-200 flex items-center justify-center"
//                   // className="px-6 py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold shadow-md hover:bg-blue-700 transition duration-200"
//                 >
//                   {/* Download PDF */}

//                   <span className="mr-2">Download PDF</span>
//                   <FontAwesomeIcon
//                     icon={faDownload}
//                     style={pulseAnimation}
//                     className="w-5 h-5"
//                   />
//                 </button>
//               </Tooltip>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center mt-12">

// <Alert
//               severity="error"
//               sx={{
//                 width: "100%",
//                 maxWidth: "600px",
//                 textAlign: "center",
//               }}
//             >
//               Please select the month for which you need the payslip statement.
//             </Alert>

//             <img
//               src="/payslip.svg"
//               style={{ height: "400px", marginBottom: "20px" }}
//               alt="No payslip available"
//             />
//           </div>
//         )}
//       </div>

//       {/* Modal for additional information */}
//       {/* <Modal
//         open={open}
//         onClose={handleCloseModal}
//         aria-labelledby="modal-title"
//         aria-describedby="modal-description"
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: isMobile ? "90%" : "60%",
//             bgcolor: "background.paper",
//             border: "2px solid #000",
//             boxShadow: 24,
//             p: 4,
//             borderRadius: 2,
//           }}
//         >
//           <h2 id="modal-title" className="text-xl font-semibold mb-4">
//             {modalContent.title}
//           </h2>
//           <p id="modal-description">{modalContent.description}</p>
//         </Box>
//       </Modal> */}

//       </div>
//         </Box>
//       </Modal>

      
//       </section>
//     </>
//   );
// };

// export default ViewPayslip;






// // {Array.from({
// //   // length: Math.max(annualIncomeValues?.length || 0, annualDeductionValues?.length || 0),
// // }).map((_, index) => (
// //   <tr key={`annual-${index}`}>
// //     {/* Annual Income */}
// //     <td className="px-4 py-2 border text-gray-700">
// //       {/* {annualIncomeValues?.[index]?.name || ""} */}
// //     </td>
// //     <td className="px-4 py-2 border text-gray-700">
// //       {/* {annualIncomeValues?.[index]?.value || ""} */}
// //     </td>

// //     {/* Annual Deduction */}
// //     <td className="px-4 py-2 border text-gray-700">
// //       {/* {annualDeductionValues?.[index]?.name || ""} */}
// //     </td>
// //     <td className="px-4 py-2 border text-gray-700">
// //       {/* {annualDeductionValues?.[index]?.value ? Math.round(annualDeductionValues[index].value) : ""} */}
// //     </td>
// //   </tr>
// // ))}


//main code paste here
  // {/* Income and Deduction Table

  //             <div className="mb-6 overflow-x-auto">
  //               <table className="w-full border border-gray-300 border-collapse">
  //                 <thead className="bg-gray-300 text-gray-800">
  //                   <tr>
  //                     <th colSpan={4} className="px-4 py-2 border">
  //                       Monthly Salary
  //                     </th>
  //                     <th colSpan={4} className="px-4 py-2 border">
  //                       Annual Salary
  //                     </th>
  //                   </tr>
  //                 </thead>
  //                 <thead className="bg-gray-50 text-gray-800">
  //                   <tr>
  //                     {/* Monthly Income/Deduction */}
  //                     <th colSpan={2} className="px-4 py-2 border">
  //                       Income
  //                     </th>
  //                     <th colSpan={2} className="px-4 py-2 border">
  //                       Deduction
  //                     </th>

  //                     {/* Annual Income/Deduction */}
  //                     <th colSpan={2} className="px-4 py-2 border">
  //                       Income
  //                     </th>
  //                     <th colSpan={2} className="px-4 py-2 border">
  //                       Deduction
  //                     </th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {/* Monthly Salary - Income and Deduction */}
  //                   {Array.from({
  //                     length: Math.max(
  //                       incomeValues?.length || 0,
  //                       deductionValues?.length || 0
  //                     ),
  //                   }).map((_, index) => (
  //                     <tr key={index}>
  //                       {/* Monthly Income */}
  //                       <td className="px-4 py-2 border text-gray-700">
  //                         {incomeValues?.[index]?.name || ""}
  //                       </td>
  //                       <td className="px-4 py-2 border text-gray-700">
  //                         {incomeValues?.[index]?.value || ""}
  //                       </td>

  //                       {/* Monthly Deduction */}
  //                       <td className="px-4 py-2 border text-gray-700">
  //                         {deductionValues?.[index]?.name || ""}
  //                       </td>
  //                       <td className="px-4 py-2 border text-gray-700">
  //                         {deductionValues?.[index]?.value
  //                           ? Math.round(deductionValues[index].value)
  //                           : ""}
  //                       </td>
  //                     </tr>
  //                   ))}

  //                   {/* Annual Salary - Income and Deduction */}
  //                   {Array.from({
  //                     // length: Math.max(annualIncomeValues?.length || 0, annualDeductionValues?.length || 0),
  //                   }).map((_, index) => (
  //                     <tr key={`annual-${index}`}>
  //                       {/* Annual Income */}
  //                       <td className="px-4 py-2 border text-gray-700">
  //                         {/* {annualIncomeValues?.[index]?.name || ""} */}
  //                       </td>
  //                       <td className="px-4 py-2 border text-gray-700">
  //                         {/* {annualIncomeValues?.[index]?.value || ""} */}
  //                       </td>

  //                       {/* Annual Deduction */}
  //                       <td className="px-4 py-2 border text-gray-700">
  //                         {/* {annualDeductionValues?.[index]?.name || ""} */}
  //                       </td>
  //                       <td className="px-4 py-2 border text-gray-700">
  //                         {/* {annualDeductionValues?.[index]?.value ? Math.round(annualDeductionValues[index].value) : ""} */}
  //                       </td>
  //                     </tr>
  //                   ))}
  //                 </tbody>
  //               </table>
  //             </div> */}
