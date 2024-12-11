// import { Info, RequestQuote } from "@mui/icons-material";
// import { Avatar, Container,  } from "@mui/material";
// import React, { useContext, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { UseContext } from "../../../State/UseState/UseContext";
// import ViewRecordModel from "./ViewRecordModel"; // Import your modal

// const ViewEmployeeRecord = ({ employeeId }) => {
//   const { organisationId } = useParams();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];

//   // State to manage modal open/close and selected file
//   const [open, setOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleOpen = (file) => {
//     setSelectedFile(file); // Set the file to be previewed
//     setOpen(true); // Open the modal
//   };

//   const handleClose = () => {
//     setOpen(false); // Close the modal
//     setSelectedFile(null); // Reset the selected file
//   };

//   // Fetch uploaded document data of the employee
//   const { data: getRecordOneEmployee } = useQuery(
//     ["getRecordOneEmployee"],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data;
//     }
//   );

//   return (
//     <>
//       <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4">
//         <div className="space-y-1 flex items-center gap-3 mb-4">
//           <Avatar className="text-white !bg-blue-500">
//             <RequestQuote />
//           </Avatar>
//           <div>
//             <h1 className="md:text-xl text-lg">View Record of Employee</h1>
//             <p className="text-sm">
//               Here you will be able to view the uploaded record of the employee.
//             </p>
//           </div>
//         </div>

//         {getRecordOneEmployee?.files?.length > 0 ? (
//           <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
//             <table className="min-w-full bg-white text-left !text-sm font-light">
//               <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//                 <tr className="font-semibold">
//                   <th scope="col" className="!text-left pl-8 py-3">
//                     Sr. No
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     File Name
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Selected Value
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {getRecordOneEmployee.files.map((file, id) => (
//                   <tr className="!font-medium border-b" key={id}>
//                     <td className="!text-left pl-8 py-3">{id + 1}</td>
//                     <td className="!text-left pl-6 py-3">{file.fileName}</td>
//                     <td className="!text-left pl-6 py-3">
//                       {file.selectedValue}
//                     </td>
//                     <td className="!text-left pl-6 py-3">
//                       <button
//                         className="text-blue-500 hover:underline"
//                         onClick={() => handleOpen(file)}
//                       >
//                         Preview
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
//             <article className="flex items-center mb-1 text-red-500 gap-2">
//               <Info className="!text-2xl" />
//               <h1 className="text-lg font-semibold">
//                 No Uploaded Document Found.
//               </h1>
//             </article>
//             <p>Please ask the employee to upload the document.</p>
//           </section>
//         )}

//         {/* Modal to preview the document */}

//         <ViewRecordModel
//           file={selectedFile}
//           onClose={handleClose}
//           open={open}
//         />
//       </Container>
//     </>
//   );
// };

// export default ViewEmployeeRecord;





// import { Info, RequestQuote } from "@mui/icons-material";
// import { Avatar, Container } from "@mui/material";
// import React, { useContext, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { UseContext } from "../../../State/UseState/UseContext";
// import ViewRecordModel from "./ViewRecordModel"; // Modal for preview

// const ViewEmployeeRecord = ({ employeeId }) => {
//   const { organisationId } = useParams();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];

//   // State to manage modal open/close and selected file
//   const [open, setOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleOpen = (file) => {
//     setSelectedFile(file); // Set the file to be previewed
//     setOpen(true); // Open the modal
//   };

//   const handleClose = () => {
//     setOpen(false); // Close the modal
//     setSelectedFile(null); // Reset the selected file
//   };

//   // Fetch uploaded document data of the employee
//   const { data: getRecordOneEmployee } = useQuery(
//     ["getRecordOneEmployee"],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data;
//     }
//   );

//   return (
//     <>
//       <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4">
//         <div className="space-y-1 flex items-center gap-3 mb-4">
//           <Avatar className="text-white !bg-blue-500">
//             <RequestQuote />
//           </Avatar>
//           <div>
//             <h1 className="md:text-xl text-lg">View Record of Employee</h1>
//             <p className="text-sm">
//               Here you will be able to view the uploaded record of the employee.
//             </p>
//           </div>
//         </div>

//         {getRecordOneEmployee?.files?.length > 0 ? (
//           <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
//             <table className="min-w-full bg-white text-left !text-sm font-light">
//               <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//                 <tr className="font-semibold">
//                   <th scope="col" className="!text-left pl-8 py-3">Sr. No</th>
//                   <th scope="col" className="px-6 py-3">File Name</th>
//                   <th scope="col" className="px-6 py-3">Selected Value</th>
//                   <th scope="col" className="px-6 py-3">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {getRecordOneEmployee.files.map((file, id) => (
//                   <tr className="!font-medium border-b" key={id}>
//                     <td className="!text-left pl-8 py-3">{id + 1}</td>
//                     <td className="!text-left pl-6 py-3">{file.fileName}</td>
//                     <td className="!text-left pl-6 py-3">{file.selectedValue}</td>
//                     <td className="!text-left pl-6 py-3">
//                       <button
//                         className="text-blue-500 hover:underline"
//                         onClick={() => handleOpen(file)}
//                       >
//                         Preview
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
//             <article className="flex items-center mb-1 text-red-500 gap-2">
//               <Info className="!text-2xl" />
//               <h1 className="text-lg font-semibold">No Uploaded Document Found.</h1>
//             </article>
//             <p>Please ask the employee to upload the document.</p>
//           </section>
//         )}

//         {/* Modal to preview the document */}
//         <ViewRecordModel
//           file={selectedFile}
//           onClose={handleClose}
//           open={open}
//         />
//       </Container>
//     </>
//   );
// };

// export default ViewEmployeeRecord;




// import React, { useState, useContext } from 'react';
// import { Container, Avatar } from '@mui/material';
// import { useParams } from 'react-router-dom';
// import { useQuery } from 'react-query';
// import axios from 'axios';
// import { UseContext } from '../../../State/UseState/UseContext';
// import ViewRecordModel from './ViewRecordModel';
// import { RequestQuote } from '@mui/icons-material';

// const ViewEmployeeRecord = ({ employeeId }) => {
//   const { organisationId } = useParams();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];

//   const [open, setOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleOpen = (file) => {
//     setSelectedFile(file);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedFile(null);
//   };

//   const { data: getRecordOneEmployee } = useQuery(
//     ['getRecordOneEmployee', employeeId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data;
//     }
//   );

//   return (
//     <Container maxWidth="xl">
//       <Avatar><RequestQuote /></Avatar>
//       <h1>View Employee Record</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>File Name</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {getRecordOneEmployee?.files?.map((file, index) => (
//             <tr key={index}>
//               <td>{file.fileName}</td>
//               <td><button onClick={() => handleOpen(file)}>Preview</button></td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <ViewRecordModel open={open} file={selectedFile} onClose={handleClose} />
//     </Container>
//   );
// };

// export default ViewEmployeeRecord;


// import React, { useState, useContext } from "react";
// import { Avatar, Container, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// import { RequestQuote, Info } from "@mui/icons-material";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { Document, Page } from 'react-pdf';

// const ViewEmployeeRecord = ({ employeeId }) => {
//   const { organisationId } = useParams();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
  
//   // State to manage modal open/close and selected file
//   const [open, setOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);

//   // Fetch uploaded document data of the employee
//   const { data: getRecordOneEmployee } = useQuery(
//     ["getRecordOneEmployee"],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data;
    
//     }

//   );


//   // Handle opening the modal and setting the selected file
//   const handleOpen = (file) => {
//     setSelectedFile(file); // Set the file to be previewed
//     console.log(file);
//     setOpen(true); // Open the modal
//   };

//   // Handle closing the modal
//   const handleClose = () => {
//     setOpen(false); // Close the modal
//     setSelectedFile(null); // Reset the selected file
//   };

//   // Handle successful PDF loading
//   const onLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };
  
// // console.log("getRecordOneEmployee",getRecordOneEmployee)
//   return (
//     <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4">
//       <div className="space-y-1 flex items-center gap-3 mb-4">
//         <Avatar className="text-white !bg-blue-500">
//           <RequestQuote />
//         </Avatar>
//         <div>
//           <h1 className="md:text-xl text-lg">View Record of Employee</h1>
//           <p className="text-sm">
//             Here you will be able to view the uploaded record of the employee.
//           </p>
//         </div>
//       </div>

//       {getRecordOneEmployee?.files?.length > 0 ? (
//         <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
//           <table className="min-w-full bg-white text-left !text-sm font-light">
//             <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//               <tr className="font-semibold">
//                 <th scope="col" className="!text-left pl-8 py-3">Sr. No</th>
//                 <th scope="col" className="px-6 py-3">File Name</th>
//                 <th scope="col" className="px-6 py-3">Selected Value</th>
//                 <th scope="col" className="px-6 py-3">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getRecordOneEmployee.files.map((file, id) => (
//                 <tr className="!font-medium border-b" key={id}>
//                   <td className="!text-left pl-8 py-3">{id + 1}</td>
//                   <td className="!text-left pl-6 py-3">{file.fileName}</td>
//                   <td className="!text-left pl-6 py-3">{file.selectedValue}</td>
//                   <td className="!text-left pl-6 py-3">
//                     <button className="text-blue-500 hover:underline" onClick={() => handleOpen(file)}>
//                       Preview
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
//           <article className="flex items-center mb-1 text-red-500 gap-2">
//             <Info className="!text-2xl" />
//             <h1 className="text-lg font-semibold">No Uploaded Document Found.</h1>
//           </article>
//           <p>Please ask the employee to upload the document.</p>
//         </section>
//       )}

//       {/* Modal to preview the document */}
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
//         <DialogTitle>Preview Document</DialogTitle>
//         <DialogContent>
//           {selectedFile && selectedFile.url ? (
//             <div className="pdf-preview-container">
//               <Document
//                 file={selectedFile.url}
//                 onLoadSuccess={onLoadSuccess}
//               >
//                 <Page pageNumber={pageNumber} />
//               </Document>
//               {/* Add navigation controls to switch between pages if needed */}
//               {numPages > 1 && (
//                 <div className="page-navigation">
//                   <Button
//                     onClick={() => setPageNumber(pageNumber - 1)}
//                     disabled={pageNumber <= 1}
//                   >
//                     Previous
//                   </Button>
//                   <span>{`Page ${pageNumber} of ${numPages}`}</span>
//                   <Button
//                     onClick={() => setPageNumber(pageNumber + 1)}
//                     disabled={pageNumber >= numPages}
//                   >
//                     Next
//                   </Button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <p>No PDF file found.</p>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default ViewEmployeeRecord;


// import React, { useState, useContext } from "react";
// import { Avatar, Container, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// import { RequestQuote, Info } from "@mui/icons-material";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { Document, Page } from 'react-pdf';

// const ViewEmployeeRecord = ({ employeeId }) => {
//   const { organisationId } = useParams();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
  
//   const [open, setOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);

//   const { data: getRecordOneEmployee } = useQuery(
//     ["getRecordOneEmployee"],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data;
//     }
//   );

//   const handleOpen = (file) => {
//     setSelectedFile(file);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedFile(null);
//   };

//   const onLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   const onLoadError = (error) => {
//     console.error("Error loading PDF:", error);
//   };

//   return (
//     <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4">
//       <div className="space-y-1 flex items-center gap-3 mb-4">
//         <Avatar className="text-white !bg-blue-500">
//           <RequestQuote />
//         </Avatar>
//         <div>
//           <h1 className="md:text-xl text-lg">View Record of Employee</h1>
//           <p className="text-sm">
//             Here you will be able to view the uploaded record of the employee.
//           </p>
//         </div>
//       </div>

//       {getRecordOneEmployee?.files?.length > 0 ? (
//         <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
//           <table className="min-w-full bg-white text-left !text-sm font-light">
//             <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//               <tr className="font-semibold">
//                 <th scope="col" className="!text-left pl-8 py-3">Sr. No</th>
//                 <th scope="col" className="px-6 py-3">File Name</th>
//                 <th scope="col" className="px-6 py-3">Selected Value</th>
//                 <th scope="col" className="px-6 py-3">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getRecordOneEmployee.files.map((file, id) => (
//                 <tr className="!font-medium border-b" key={id}>
//                   <td className="!text-left pl-8 py-3">{id + 1}</td>
//                   <td className="!text-left pl-6 py-3">{file.fileName}</td>
//                   <td className="!text-left pl-6 py-3">{file.selectedValue}</td>
//                   <td className="!text-left pl-6 py-3">
//                     <button className="text-blue-500 hover:underline" onClick={() => handleOpen(file)}>
//                       Preview
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
//           <article className="flex items-center mb-1 text-red-500 gap-2">
//             <Info className="!text-2xl" />
//             <h1 className="text-lg font-semibold">No Uploaded Document Found.</h1>
//           </article>
//           <p>Please ask the employee to upload the document.</p>
//         </section>
//       )}

//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
//         <DialogTitle>Preview Document</DialogTitle>
//         <DialogContent>
//           {selectedFile && selectedFile.url ? (
//             <div className="pdf-preview-container">
//               <Document
//                 file={selectedFile.url}
//                 onLoadSuccess={onLoadSuccess}
//                 onLoadError={onLoadError}  // Added error handling
//               >
//                 <Page pageNumber={pageNumber} />
//               </Document>
//               {numPages > 1 && (
//                 <div className="page-navigation">
//                   <Button
//                     onClick={() => setPageNumber(pageNumber - 1)}
//                     disabled={pageNumber <= 1}
//                   >
//                     Previous
//                   </Button>
//                   <span>{`Page ${pageNumber} of ${numPages}`}</span>
//                   <Button
//                     onClick={() => setPageNumber(pageNumber + 1)}
//                     disabled={pageNumber >= numPages}
//                   >
//                     Next
//                   </Button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <p>No PDF file found.</p>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default ViewEmployeeRecord;



// import React, { useState, useContext } from "react";
// import { Avatar, Container, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// import { RequestQuote, Info } from "@mui/icons-material";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { UseContext } from "../../../State/UseState/UseContext";

// const ViewEmployeeRecord = ({ employeeId }) => {
//   const { organisationId } = useParams();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];

//   const [open, setOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const { data: getRecordOneEmployee } = useQuery(
//     ["getRecordOneEmployee"],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data;
//     }
//   );

//   const handleOpen = (file) => {
//     setSelectedFile(file);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedFile(null);
//   };

//   return (
//     <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4">
//       <div className="space-y-1 flex items-center gap-3 mb-4">
//         <Avatar className="text-white !bg-blue-500">
//           <RequestQuote />
//         </Avatar>
//         <div>
//           <h1 className="md:text-xl text-lg">View Record of Employee</h1>
//           <p className="text-sm">
//             Here you will be able to view the uploaded record of the employee.
//           </p>
//         </div>
//       </div>

//       {getRecordOneEmployee?.files?.length > 0 ? (
//         <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
//           <table className="min-w-full bg-white text-left !text-sm font-light">
//             <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//               <tr className="font-semibold">
//                 <th scope="col" className="!text-left pl-8 py-3">Sr. No</th>
//                 <th scope="col" className="px-6 py-3">File Name</th>
//                 <th scope="col" className="px-6 py-3">Selected Value</th>
//                 <th scope="col" className="px-6 py-3">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getRecordOneEmployee.files.map((file, id) => (
//                 <tr className="!font-medium border-b" key={id}>
//                   <td className="!text-left pl-8 py-3">{id + 1}</td>
//                   <td className="!text-left pl-6 py-3">{file.fileName}</td>
//                   <td className="!text-left pl-6 py-3">{file.selectedValue}</td>
//                   <td className="!text-left pl-6 py-3">
//                     <button className="text-blue-500 hover:underline" onClick={() => handleOpen(file)}>
//                       Preview
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
//           <article className="flex items-center mb-1 text-red-500 gap-2">
//             <Info className="!text-2xl" />
//             <h1 className="text-lg font-semibold">No Uploaded Document Found.</h1>
//           </article>
//           <p>Please ask the employee to upload the document.</p>
//         </section>
//       )}

//       {/* Modal to preview the document */}
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
//         <DialogTitle>Preview Document</DialogTitle>
//         <DialogContent>
//           {selectedFile && selectedFile.url ? (
//             <div className="pdf-preview-container">
//               <object
//                 data={selectedFile.url}
//                 type="application/pdf"
//                 width="100%"
//                 height="600px"
//               >
//                 <p>Your browser does not support PDF viewing. Please download the PDF to view it: <a href={selectedFile.url} target="_blank" rel="noopener noreferrer">Download PDF</a></p>
//               </object>
//             </div>
//           ) : (
//             <p>No PDF file found.</p>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default ViewEmployeeRecord;




import React, { useState, useContext } from "react";
import {  Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Info } from "@mui/icons-material";
import { useQuery } from "react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";

const ViewEmployeeRecord = ({ employeeId }) => {
  const { organisationId } = useParams(); // Getting organisationId from URL params
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // useQuery now listens for changes in employeeId and organisationId
  const { data: getRecordOneEmployee } = useQuery(
    ["getRecordOneEmployee", employeeId], // Dependency on employeeId to refetch on change
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    },
    {
      enabled: !!employeeId, // Only run the query if employeeId exists
    }
  );

  const handleOpen = (file) => {
    setSelectedFile(file);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  return (
  // <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4">
    //   <div className="space-y-1 flex items-center gap-3 mb-4">
    //     <Avatar className="text-white !bg-blue-500">
    //       <RequestQuote />
    //     </Avatar>
    //     <div>
    //       <h1 className="md:text-xl text-lg">View Record of Employee</h1>
    //       <p className="text-sm">
    //         Here you will be able to view the uploaded record of the employee.
    //       </p>
    //     </div>
    //   </div>

    <BoxComponent>
      <HeadingOneLineInfo heading={"View Record of Employee"} info={" Here you will be able to view the uploaded record of the employee."} />

      {getRecordOneEmployee?.files?.length > 0 ? (
        <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
          <table className="min-w-full bg-white text-left !text-sm font-light">
            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
              <tr className="font-semibold">
                <th scope="col" className="!text-left pl-8 py-3">Sr. No</th>
                <th scope="col" className="px-6 py-3">File Name</th>
                <th scope="col" className="px-6 py-3">Selected Value</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {getRecordOneEmployee.files.map((file, id) => (
                <tr className="!font-medium border-b" key={id}>
                  <td className="!text-left pl-8 py-3">{id + 1}</td>
                  <td className="!text-left pl-6 py-3">{file.fileName}</td>
                  <td className="!text-left pl-6 py-3">{file.selectedValue}</td>
                  <td className="!text-left pl-6 py-3">
                    <button className="text-blue-500 hover:underline" onClick={() => handleOpen(file)}>
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
          <article className="flex items-center mb-1 text-red-500 gap-2">
            <Info className="!text-2xl" />
            <h1 className="text-lg font-semibold">No Uploaded Document Found.</h1>
          </article>
          <p>Please ask the employee to upload the document.</p>
        </section>
      )}

      {/* Modal to preview the document */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>Preview Document</DialogTitle>
        <DialogContent>
          {selectedFile && selectedFile.url ? (
            <div className="pdf-preview-container">
              <object
                data={selectedFile.url}
                type="application/pdf"
                width="100%"
                height="600px"
              >
                <p>Your browser does not support PDF viewing. Please download the PDF to view it: <a href={selectedFile.url} target="_blank" rel="noopener noreferrer">Download PDF</a></p>
              </object>
            </div>
          ) : (
            <p>No PDF file found.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
     
      </BoxComponent> 
    
  );
};

export default ViewEmployeeRecord;
