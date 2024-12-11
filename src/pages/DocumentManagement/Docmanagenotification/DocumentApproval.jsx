
// import React from "react";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import axios from "axios";
// import { Avatar, CircularProgress, IconButton } from "@mui/material";
// import { Link, useParams } from "react-router-dom";
// import { Visibility } from "@mui/icons-material"; // Import the eye icon
// import useGetUser from "../../../hooks/Token/useUser"; // Assuming this hook gives the logged-in user's token

// const DocumentApproval = () => {
//   const { authToken } = useGetUser();
//   const { organisationId } = useParams(); // Assuming the organization ID is part of the route params
//   const queryClient = useQueryClient();

//   // Fetch documents using react-query
//   const { data, isLoading, isFetching, error } = useQuery({
//     queryKey: ["Documents", organisationId],
//     queryFn: async () => {
//       const res = await axios.get(
//         `${process.env.REACT_APP_API}/route/org/getdocs`, // Adjust your endpoint if needed
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return res.data;
//     },
//     enabled: !!authToken && !!organisationId, // Ensures that query is fired only when token & orgId exist
//   });

//   // Mutation to update document status (Approve/Reject)
//   const { mutate: updateStatus } = useMutation(
//     async ({ docId, status }) => {
//       const res = await axios.patch(
//         `${process.env.REACT_APP_API}/route/org/adddocuments/updatedocstatus`,
//         { docId, newStatus: status },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return res.data;
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(["Documents", organisationId]);
//       },
//     }
//   );

//   // Handle status update (approve or reject)
//   const handleAction = (docId, status) => {
//     updateStatus({ docId, status });
//   };

//   // Show loading indicator while fetching
//   if (isLoading || isFetching) {
//     return (
//       <div className="flex justify-center items-center min-h-[90vh]">
//         <CircularProgress />
//       </div>
//     );
//   }

//   // Show error message if fetching failed
//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-[90vh]">
//         <h1>Error loading documents.</h1>
//       </div>
//     );
//   }

//   // Filter the documents where status is "Pending"
//   const pendingDocuments = data?.doc?.filter(
//     (document) => document.docstatus === "Pending"
//   );

//   return (
//     <div>
//       <section className="min-h-[90vh] flex">
//         {/* Left Sidebar for Employee Search */}
//         <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
//           <div className="p-2 my-2 !py-2">
//             <div className="space-y-2">
//               <div className="flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]">
//                 <input
//                   type={"text"}
//                   placeholder={"Search Employee"}
//                   className="border-none bg-white w-full outline-none px-2"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Employee List (if any) */}
//           <div className="space-y-2">
//             {pendingDocuments?.map((document, idx) => (
//               <Link
//                 key={idx}
//                 to={`/employee-details/${document.employeeId._id}`}
//                 className="px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50"
//               >
//                 <Avatar />
//                 <div>
//                   <h1 className="md:text-[1.2rem] text-sm">
//                     {document.employeeId?.name}
//                   </h1>
//                   <h1 className="md:text-sm text-xs text-gray-500">
//                     {document.employeeId?.email}
//                   </h1>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </article>

//         {/* Main Content Area for Documents */}
//         <article className="w-[75%] min-h-[90vh] border-l-[.5px] bg-gray-50">
//           <div className="px-4 pt-2">
//             <h1 className="text-xl font-semibold">Document Approval</h1>
//             <p className="text-sm text-gray-600">
//               Approve or reject documents submitted by employees.
//             </p>
//           </div>

//           <div className="px-4 pt-2">
//             {pendingDocuments?.length === 0 ? (
//               <div className="flex items-center justify-center my-4">
//                 <h1 className="text-lg w-full text-gray-700 bg-blue-200 p-4 rounded-md">
//                   No Pending Documents Found
//                 </h1>
//               </div>
//             ) : (
//               pendingDocuments?.map((document, idx) => (
//                 <div key={idx} className="p-4 border my-2 rounded-md">
//                   <h2 className="text-xl font-bold">{document.title}</h2>
//                   {/* <p className="text-sm">{document.details}</p> */}
//                   <p className="text-sm">Status: {document.docstatus}</p>

//                   <span className="text-sm">View Letter :</span>
//                   <IconButton
//                     onClick={() => window.open(document.url, "_blank")}
//                     color="primary"
//                     aria-label="View letter"
//                   >
//                     <Visibility />
//                   </IconButton>

//                   {/* Display Approve/Reject buttons only if document status is Pending */}
//                   {document?.docstatus === "Pending" && (
//                     <div className="flex gap-4 mt-2">
//                       <button
//                         onClick={() => handleAction(document._id, "Accepted")}
//                         className="bg-green-500 text-white px-4 py-2 rounded"
//                       >
//                         Approve
//                       </button>
//                       <button
//                         onClick={() => handleAction(document._id, "Rejected")}
//                         className="bg-red-500 text-white px-4 py-2 rounded"
//                       >
//                         Reject
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         </article>
//       </section>
//     </div>
//   );
// };

// export default DocumentApproval;






// import React from "react";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import axios from "axios";
// import { Avatar, CircularProgress, IconButton } from "@mui/material";
// import { Link, useParams } from "react-router-dom";
// import { Visibility } from "@mui/icons-material"; // Import the eye icon
// import useGetUser from "../../../hooks/Token/useUser"; // Assuming this hook gives the logged-in user's token


// const DocumentApproval = () => {
//     const { authToken } = useGetUser(); // Assuming the logged-in user's token is retrieved here
//     const { organisationId } = useParams(); // Organization ID from route params
//     const queryClient = useQueryClient();

//     // Fetch documents for the logged-in manager
//     const { data, isLoading, isFetching, error } = useQuery(
//       ["Documents", organisationId],
//       async () => {
//         const res = await axios.get(
//           `${process.env.REACT_APP_API}/route/org/getdocs/manageraprove`, // Fetch the documents for the manager
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//         return res.data;
//       },
//       {
//         enabled: !!authToken && !!organisationId, // Only fetch if authToken & organisationId exist
//       }
//     );

//     // Mutation to update document status (Approve/Reject)
//     const { mutate: updateStatus } = useMutation(
//       async ({ docId, status }) => {
//         const res = await axios.patch(
//           `${process.env.REACT_APP_API}/route/org/adddocuments/updatedocstatus`,
//           { docId, newStatus: status },
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//         return res.data;
//       },
//       {
//         onSuccess: () => {
//           queryClient.invalidateQueries(["Documents", organisationId]);
//         },
//       }
//     );

//     // Handle status update (approve or reject)
//     const handleAction = (docId, status) => {
//       updateStatus({ docId, status });
//     };

//     // Show loading indicator while fetching
//     if (isLoading || isFetching) {
//       return (
//         <div className="flex justify-center items-center min-h-[90vh]">
//           <CircularProgress />
//         </div>
//       );
//     }

//     // Show error message if fetching failed
//     if (error) {
//       return (
//         <div className="flex justify-center items-center min-h-[90vh]">
//           <h1>Error loading documents.</h1>
//         </div>
//       );
//     }

//     // Filter the documents based on their status (e.g., Pending)
//     const pendingDocuments = data?.doc?.filter(
//       (document) => document.docstatus === "Pending"
//     );

//     return (
//       <div>
//         <section className="min-h-[90vh] flex">
//           {/* Left Sidebar for HR List */}
//           <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
//             <div className="p-2 my-2 !py-2">
//               <div className="space-y-2">
//                 <div className="flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]">
//                   <input
//                     type={"text"}
//                     placeholder={"Search Employee"}
//                     className="border-none bg-white w-full outline-none px-2"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Employee List */}
//             <div className="space-y-2">
//               {pendingDocuments?.map((document, idx) => (
//                 <Link
//                   key={idx}
//                   to={`/employee-details/${document.employeeId._id}`}
//                   className="px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50"
//                 >
//                   <Avatar />
//                   <div>
//                     <h1 className="md:text-[1.2rem] text-sm">{document.employeeId?.name}</h1>
//                     <h1 className="md:text-sm text-xs text-gray-500">{document.employeeId?.email}</h1>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </article>

//           {/* Main Content Area for Documents */}
//           <article className="w-[75%] min-h-[90vh] border-l-[.5px] bg-gray-50">
//             <div className="px-4 pt-2">
//               <h1 className="text-xl font-semibold">Document Approval</h1>
//               <p className="text-sm text-gray-600">Approve or reject documents submitted by employees.</p>
//             </div>

//             <div className="px-4 pt-2">
//               {pendingDocuments?.length === 0 ? (
//                 <div className="flex items-center justify-center my-4">
//                   <h1 className="text-lg w-full text-gray-700 bg-blue-200 p-4 rounded-md">
//                     No Pending Documents Found
//                   </h1>
//                 </div>
//               ) : (
//                 pendingDocuments?.map((document, idx) => (
//                   <div key={idx} className="p-4 border my-2 rounded-md">
//                     <h2 className="text-xl font-bold">{document.title}</h2>
//                     <p className="text-sm">Status: {document.docstatus}</p>
//                     <span className="text-sm">View Letter:</span>
//                     <IconButton
//                       onClick={() => window.open(document.url, "_blank")}
//                       color="primary"
//                       aria-label="View letter"
//                     >
//                       <Visibility />
//                     </IconButton>

//                     {document?.docstatus === "Pending" && (
//                       <div className="flex gap-4 mt-2">
//                         <button
//                           onClick={() => handleAction(document._id, "Accepted")}
//                           className="bg-green-500 text-white px-4 py-2 rounded"
//                         >
//                           Approve
//                         </button>
//                         <button
//                           onClick={() => handleAction(document._id, "Rejected")}
//                           className="bg-red-500 text-white px-4 py-2 rounded"
//                         >
//                           Reject
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           </article>
//         </section>
//       </div>
//     );
//   };
//   export default DocumentApproval;





import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Avatar, IconButton } from "@mui/material";
import { useParams } from "react-router-dom";
import { Visibility } from "@mui/icons-material"; // Eye icon for viewing the document
import useGetUser from "../../../hooks/Token/useUser"; // Get logged-in user's data

const DocumentApproval = () => {
  const { authToken } = useGetUser(); // Logged-in user's token
  const { organisationId } = useParams(); // Organization ID from URL params
  const queryClient = useQueryClient();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null); // Track selected employee

  // Fetch employees whose documents are pending approval by the logged-in manager
  const { data: employeeData, error: employeeError } = useQuery(
    ["employeesForManager", organisationId],
    async () => {
      const res = await axios.get(`${process.env.REACT_APP_API}/route/org/getdocs/manageraprove`, {
        headers: {
          Authorization: authToken,
        },
      });
      return res.data;
    },
    {
      enabled: !!authToken && !!organisationId, // Fetch only if authToken & organisationId exist
    }
  );

  // Fetch documents for the selected employee
  const { data: documentData, error: documentError } = useQuery(
    ["documents", selectedEmployeeId],
    async () => {
      if (!selectedEmployeeId) return [];
      const res = await axios.get(
        `${process.env.REACT_APP_API}/route/org/getdocs/employee/${selectedEmployeeId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return res.data;
    },
    {
      enabled: !!selectedEmployeeId && !!authToken, // Fetch only if employee is selected
    }
  );

  // Mutation to update document status (approve/reject)
  const { mutate: updateStatus } = useMutation(
    async ({ docId, status }) => {
      const res = await axios.patch(
        `${process.env.REACT_APP_API}/route/org/adddocuments/updatedocstatus`,
        { docId, newStatus: status },
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
        queryClient.invalidateQueries(["documents", selectedEmployeeId]);
      },
    }
  );

  // Handle document approval/rejection
  const handleAction = (docId, status) => {
    updateStatus({ docId, status });
  };

  // Show error messages if fetching failed
  if (employeeError || documentError) {
    // Access the error message from either the employeeError or documentError
    const errorMessage = employeeError?.response?.data?.message || documentError?.response?.data?.message || "An unexpected error occurred.";

    return (
      <div className="flex justify-center items-center min-h-[90vh]">
        <h1>{errorMessage}</h1>
      </div>
    );
  }


  return (
    <div>
      <section className="min-h-[90vh] flex">
        {/* Left Sidebar for Employee List */}
        <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
          <div className="p-2 my-2 !py-2">
            <div className="space-y-2">
              <div className="flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]">
                <input
                  type={"text"}
                  placeholder={"Search Employee"}
                  className="border-none bg-white w-full outline-none px-2"
                />
              </div>
            </div>
          </div>

          {/* Employee List */}
          <div className="space-y-2">
            {employeeData?.employees?.map((employee) => (
              <div
                key={employee._id}
                onClick={() => setSelectedEmployeeId(employee._id)} // Set selected employee
                className="px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 cursor-pointer"
              >
                <Avatar />
                <div>
                  <h1 className="md:text-[1.2rem] text-sm">{employee.name}</h1>
                  <h1 className="md:text-sm text-xs text-gray-500">{employee.email}</h1>
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Right Content Area for Documents */}
        <article className="w-[75%] min-h-[90vh] border-l-[.5px] bg-gray-50">
          <div className="px-4 pt-2">
            <h1 className="text-xl font-semibold">Document Approval</h1>
            <p className="text-sm text-gray-600">
              Approve or reject documents submitted by employees.
            </p>
          </div>

          {/* Show documents for the selected employee */}
          <div className="px-4 pt-2">
            {documentData?.documents?.length === 0 ? (
              <div className="flex items-center justify-center my-4">
                <h1 className="text-lg w-full text-gray-700 bg-blue-200 p-4 rounded-md">
                  No Documents Found for this Employee
                </h1>
              </div>
            ) : (
              documentData?.documents?.map((document) => (
                <div key={document._id} className="p-4 border my-2 rounded-md">
                  <h2 className="text-xl font-bold">{document.letterType}</h2>
                  <p className="text-sm">Status: {document.docstatus}</p>

                  <span className="text-sm">View Letter:</span>
                  <IconButton
                    onClick={() => window.open(document.url, "_blank")}
                    color="primary"
                    aria-label="View letter"
                  >
                    <Visibility />
                  </IconButton>

                  {/* Display Approve/Reject buttons */}
                  {document.docstatus === "Pending" && (
                    <div className="flex gap-4 mt-2">
                      <button
                        onClick={() => handleAction(document._id, "Accepted")}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(document._id, "Rejected")}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </div>
  );
};

export default DocumentApproval;
