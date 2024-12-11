// // DocList.js
// import { DeleteOutline, EditOutlined } from "@mui/icons-material";
// import { IconButton } from "@mui/material";
// import React from "react";

// const DocList = ({ data, onEdit, onDelete }) => {
//   const handleEdit = (id) => {
//     onEdit(id);
//   };
//   const handleDelete = (id) => {
//     onDelete(id);
//   };

//   return (
//     <div className="w-full">
//       <div className="w-full"></div>
//       <table className="min-w-full bg-white text-left !text-sm font-light">
//         <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//           <tr className="!font-semibold">
//             <th scope="col" className="!text-left pl-8 py-3 w-1/3">
//               Sr. No
//             </th>
//             <th scope="col" className="py-3 w-1/3">
//               title
//             </th>
//             <th scope="col" className="py-3 w-1/3 !text-right pr-8">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {data?.map((item, idx) => (
//             <tr className="!font-medium border-b" key={idx}>
//               <td className="!text-left pl-9 w-1/3">{idx + 1}</td>
//               <td className="py-3 text-left w-1/3">{item.title}</td>
//               <td className="text-right pr-4 w-1/3">
//                 <IconButton
//                   color="primary"
//                   aria-label="edit"
//                   onClick={() => handleEdit(item._id)}
//                 >
//                   <EditOutlined />
//                 </IconButton>
//                 <IconButton
//                   color="error"
//                   onClick={() => handleDelete(item._id)}
//                   aria-label="delete"
//                 >
//                   <DeleteOutline />
//                 </IconButton>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DocList;

// import { DeleteOutline, EditOutlined, Visibility } from "@mui/icons-material";
// import { IconButton } from "@mui/material";
// import React from "react";

// const DocList = ({ data, onEdit, onDelete, onViewPDF }) => {
//   const handleEdit = (id) => {
//     onEdit(id);
//   };

//   const handleDelete = (id) => {
//     onDelete(id);
//   };

//  // Function to open the PDF in a new tab
//  const handleViewPDF = (pdfUrl) => {
//   if (pdfUrl) {
//     window.open(pdfUrl, "_blank"); // Open PDF in new tab
//   } else {
//     alert("PDF URL is not available.");
//   }
// };

//   // const handleViewPDF = (url) => {
//   //   onViewPDF(url); // Calls the function passed via props to open the PDF URL
//   // };

//   return (
//     <div className="w-full">
//       <div className="w-full"></div>
//       <table className="min-w-full bg-white text-left !text-sm font-light">
//         <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//           <tr className="!font-semibold">
//             <th scope="col" className="!text-left pl-8 py-3 w-1/3">
//               Sr. No
//             </th>
//             <th scope="col" className="py-3 w-1/3">
//               Title
//             </th>
//             <th scope="col" className="py-3 w-1/3 !text-right pr-8">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {data?.map((item, idx) => (
//             <tr className="!font-medium border-b" key={idx}>
//               <td className="!text-left pl-9 w-1/3">{idx + 1}</td>
//               <td className="py-3 text-left w-1/3">{item.title}</td>
//               <td className="text-right pr-4 w-1/3">
//               <IconButton
//                   color="primary"
//                   aria-label="view"
//                   onClick={() => handleViewPDF(item.url)} // Trigger PDF view when clicked
//                 >
//                   <Visibility /> {/* Eye symbol */}
//                 </IconButton>
//                 <IconButton
//                   color="primary"
//                   aria-label="edit"
//                   onClick={() => handleEdit(item._id)}
//                 >
//                   <EditOutlined />
//                 </IconButton>
//                 <IconButton
//                   color="error"
//                   onClick={() => handleDelete(item._id)}
//                   aria-label="delete"
//                 >
//                   <DeleteOutline />
//                 </IconButton>

//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DocList;

// import { DeleteOutline, EditOutlined, Visibility, CheckCircle, Cancel } from "@mui/icons-material";
// import { IconButton } from "@mui/material";
// import React from "react";
// // import { DeleteOutline, EditOutlined, Visibility, CheckCircle } from "@mui/icons-material";
// // import { IconButton } from "@mui/material";
// // import React from "react";

// const DocList = ({ data, onEdit, onDelete, onViewPDF, onApprove }) => {
//   const handleEdit = (id) => {
//     onEdit(id);
//   };

//   // Function to open the PDF in a new tab
//   const handleViewPDF = (pdfUrl) => {
//     if (pdfUrl) {
//       window.open(pdfUrl, "_blank"); // Open PDF in new tab
//     } else {
//       alert("PDF URL is not available.");
//     }
//   };

//   const handleDelete = (id) => {
//     onDelete(id);
//   };

//   const handleApprove = (id) => {
//     onApprove(id); // Calls the approve function passed via props
//   };

//   return (
//     <div className="w-full">
//       <div className="w-full"></div>
//       <table className="min-w-full bg-white text-left !text-sm font-light">
//         <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//           <tr className="!font-semibold">
//             <th scope="col" className="!text-left pl-8 py-3 w-1/4">Sr. No</th>
//             <th scope="col" className="py-3 w-1/4">Title</th>
//             <th scope="col" className="py-3 w-1/4">Status</th>
//             <th scope="col" className="py-3 w-1/4 !text-right pr-8">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data?.map((item, idx) => (
//             <tr className="!font-medium border-b" key={idx}>
//               <td className="!text-left pl-9 w-1/4">{idx + 1}</td>
//               <td className="py-3 text-left w-1/4">{item.title}</td>
//               <td className="py-3 text-left w-1/4">
//                 {item.status || "To Do"} {/* Display Status */}
//               </td>
//               <td className="text-right pr-4 w-1/4">
//                 {/* Show approval symbol only if Letter Type workflow is true and status is 'To Do' */}
//                 {item.letterType && item.letterType.workflow === true && item.status === "To Do" && (
//                   <IconButton color="primary" aria-label="approve" onClick={() => handleApprove(item._id)}>
//                     <CheckCircle /> {/* Approval symbol */}
//                   </IconButton>
//                 )}

//                 {/* Other actions */}
//                 <IconButton color="primary" aria-label="view" onClick={() => handleViewPDF(item.url)}>
//                   <Visibility /> {/* View PDF */}
//                 </IconButton>
//                 <IconButton color="primary" aria-label="edit" onClick={() => handleEdit(item._id)}>
//                   <EditOutlined />
//                 </IconButton>
//                 <IconButton color="error" onClick={() => handleDelete(item._id)} aria-label="delete">
//                   <DeleteOutline />
//                 </IconButton>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DocList;






import { DeleteOutline, EditOutlined, Visibility } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import useLetterWorkflowStore from "./useletterworkflow";
import IosShareIcon from "@mui/icons-material/IosShare";
import {  useMutation } from "react-query";
import axios from "axios";
import useGetUser from "../../../hooks/Token/useUser";
import SendIcon from "@mui/icons-material/Send";
import { UseContext } from "../../../State/UseState/UseContext";
import { useContext } from "react";

const DocList = ({ data, onEdit, onDelete, onViewPDF, onApprove }) => {
  // Fetch the letter workflow data from Zustand store
  const { letterWorkflow } = useLetterWorkflowStore();
  const { setAppAlert } = useContext(UseContext);
  const { authToken } = useGetUser();
  console.log("letterWorkflow", letterWorkflow);

  const handleEdit = (id) => {
    onEdit(id);
  };

  // Function to open the PDF in a new tab
  const handleViewPDF = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank"); // Open PDF in new tab
    } else {
      alert("PDF URL is not available.");
    }
  };

  const handleDelete = (id) => {
    onDelete(id);
  };

  const mutation = useMutation(async ({ docId, newStatus }) => {
    const response = await axios.patch(
      `${process.env.REACT_APP_API}/route/org/adddocuments/updatedocstatus`,
      { docId, newStatus },
      {
        headers: {
          Authorization: authToken, // Ensure `authToken` is available in your scope
        },
      }
    );
    return response.data; // Return the response
  });

  const handleApprove = (docId) => {
    const newStatus = "Pending";
    setAppAlert({
      alert: true,
      type: "success",
      msg: "Document is sent To Mamager for approval",
    });
    // Call the mutation trigger function to update the status
    mutation.mutate({ docId, newStatus });
    // QueryClient.invalidateQueries("getOrgDocs");
  };

  const handleSendButtonClick = async (item) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/org/updatearr/${item._id}`,
        {
          employeeId: [item.empidd], // Send as a string, no need to convert to ObjectId
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document is sent successfully",
      });
      // QueryClient.invalidateQueries("getOrgDocs");
    } catch (error) {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Document not sent successfully",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="w-full"></div>
      <table className="min-w-full bg-white text-left !text-sm font-light">
        <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
          <tr className="!font-semibold">
            <th scope="col" className="!text-left pl-6 py-3 w-1/10">
              Sr. No
            </th>
            <th scope="col" className="py-3 pl-2 w-1/40">
              Lettere Type
            </th>
            <th scope="col" className="py-3 w-1/10">
              Status
            </th>
            <th scope="col" className="py-3 w-1/40 !text-right pr-16">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, idx) => {
            // Fetch the workflow status for the current document's letter type
            const workflowStatus = letterWorkflow[item.letterType]?.workflow; // Access directly without [0]
            console.log("workflowStatus1", workflowStatus);
            const status = item.docstatus || "To Do"; // Default to "To Do" if no status is provided

            return (
              <tr className="!font-medium border-b" key={idx}>
                <td className="!text-left pl-9 w-1/10">{idx + 1}</td>
                <td className="py-3 text-left w-1/40">{item.letterType}</td>
                <td className="py-3 text-left w-1/10">{item.docstatus}</td>
                <td className="text-right pr-4 w-1/40">
                  {/* Show approval symbol only if Letter Type workflow is true and status is 'To Do' */}
                  {workflowStatus === true && status === "To Do" && (
                    <IconButton
                      color="primary"
                      aria-label="approve"
                      onClick={() => handleApprove(item._id)}
                    >
                      <IosShareIcon /> {/* Approval symbol */}
                    </IconButton>
                  )}

                  {/* Show Send icon if conditions are met */}
                  {(workflowStatus === false && status === "To Do") ||
                  (workflowStatus === true && status === "Accepted") ? (
                    <IconButton
                      color="primary"
                      aria-label="send"
                      onClick={() => handleSendButtonClick(item)}
                    >
                      <SendIcon />
                    </IconButton>
                  ) : null}

                  {/* Other actions */}
                  <IconButton
                    color="primary"
                    aria-label="view"
                    onClick={() => handleViewPDF(item.url)}
                  >
                    <Visibility /> {/* View PDF */}
                  </IconButton>

                  <IconButton
                    color="primary"
                    aria-label="edit"
                    onClick={() => handleEdit(item._id)}
                  >
                    <EditOutlined />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(item._id)}
                    aria-label="delete"
                  >
                    <DeleteOutline />
                  </IconButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DocList;
