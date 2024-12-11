// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { Button, Container, TextField, Typography } from "@mui/material";
// import axios from "axios";
// import jsPDF from "jspdf";
// import React, { useContext, useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import stripTags from "striptags";
// import { UseContext } from "../../State/UseState/UseContext";
// import useGetUser from "../../hooks/Token/useUser";
// import { getSignedUrlForOrgDocs, uploadFile } from "../../services/docManageS3";
// import DataTable from "./components/DataTable";
// import DocList from "./components/DocList";
// import Options from "./components/Options";
// import { useParams } from "react-router-dom";
// import useLetterWorkflowStore from "./components/useletterworkflow";
// import useEmployeeStore from "./components/useEmployeeStore";
// import UserProfile from "../../hooks/UserData/useUser";

// const DocManageAuth = () => {
//   const { authToken } = useGetUser();
//   // to get current user information and user role
//   const { getCurrentUser } = UserProfile();

//   const user = getCurrentUser();
//   console.log("user1111", user);
//   const Hrid = user._id;
//   const { organisationId } = useParams();
//   const [option, setOption] = useState("");
//   const querClient = useQueryClient();
//   const [docId, setDocId] = useState("");
//   const { setAppAlert } = useContext(UseContext);
//   const [letterTypes, setLetterTypes] = useState([]);
//   const [selectedLetterType, setSelectedLetterType] = useState(""); // Store the selected letter type
//   // const [letterWorkflow, setLetterWorkflow] = useState({});
//   const setLetterWorkflow = useLetterWorkflowStore(
//     (state) => state.setLetterWorkflow
//   );
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   // const [employeeId, setEmployeeId] = useState("");
//   const [managerId, setManagerId] = useState("");
//   const { savedEmployees } = useEmployeeStore(); // Get employees from Zustand
//   const { savedManagers } = useEmployeeStore(); // Destructure savedManagers from the store

//   const { data: data2 } = useQuery(`getOrgDocs`, async () => {
//     const response = await axios.get(
//       `${process.env.REACT_APP_API}/route/org/getdocs/letters`,
//       {
//         headers: { Authorization: authToken },
//       }
//     );

//     return response.data.doc;
//   });

//   console.log(data2);

//   const [newDocument, setNewDocument] = useState({
//     header: "",
//     footer: "",
//     details: "",
//     title: "",
//     applicableDate: "",

//   });
//   console.log("type", newDocument);

//   const handleSelectChange = (e) => {
//     setSelectedLetterType(e.target.value); // Update the selected letter type
//   };

//   useEffect(() => {
//     const fetchLetterWorkflow = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/letter/get/${organisationId}`,
//           {
//             headers: { Authorization: authToken },
//           }
//         );

//         // Extract letter types and update Zustand store
//         const fetchedLetterTypes = Object.keys(response.data);
//         setLetterTypes(fetchedLetterTypes); // Save letter types for dropdown

//         fetchedLetterTypes.forEach((letterType) => {
//           const workflowStatus = response.data[letterType].workflow;
//           setLetterWorkflow(letterType, workflowStatus);
//         });
//       } catch (error) {
//         console.error("Error fetching letter workflow:", error);
//         // Optionally, you could set an error state here to display a message to the user
//       }
//     };

//     if (organisationId && authToken) {
//       fetchLetterWorkflow();
//     }
//   }, [organisationId, authToken, setLetterWorkflow]); //

//   const handleEditDocument = async (id) => {
//     try {
//       setDocId(id.toString());
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/org/getdoc/${id}`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       const document = response.data.doc;
//       console.log("Dc", document)
//           // Convert the applicableDate to the 'YYYY-MM-DD' format
//           const formattedDate = new Date(document.applicableDate).toISOString().split('T')[0];
//             // Update the state with the formatted date
//       setNewDocument({
//         selectedLetterType: document.letterType,// Make sure this is set correctly
//         header:document.header,
//         title: document.title,
//         details: document.details,
//         applicableDate: formattedDate,  // Set the formatted date here
//         type: document.type,
//         footer:document.footer,
//       });
//       // setNewDocument(response.data.doc);
//     } catch (error) {
//       console.error("Error while fetching document for editing:", error);
//     }
//   };

//   const handleDeleteDoc = async (id) => {
//     try {
//       const resp = await axios.delete(
//         `${process.env.REACT_APP_API}/route/org/deletedoc/${id}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log(resp);
//       querClient.invalidateQueries("getOrgDocs");
//       setAppAlert({
//         alert: true,
//         type: "success",
//         msg: "Document Deleted Successfully",
//       });
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   useEffect(() => {
//     setDocId("");
//     setNewDocument({
//       title: "",
//       details: "",
//       applicableDate: "",
//     });
//   }, [option]);

//   const handleSelectEmployee = (e) => {
//     const selectedEmployeeId = e.target.value;
//     setSelectedEmployee(selectedEmployeeId); // Store employee's ID
//     const managerId = savedManagers[selectedEmployeeId];
//     setManagerId(managerId);
//   };

//   const selectedEmployeeName =
//     savedEmployees.find((emp) => emp._id === selectedEmployee)?.first_name ||
//     "";

//   const handleCreateDocument = async () => {

//   try {

//     const doc = new jsPDF();
//     doc.setFontSize(12);
//     let yPosition = 20; // Initial Y position

//     // Add the header (with a larger font size for emphasis)
//     if (newDocument.header) {
//       doc.setFont('times', 'normal'); // Use a serif font for the header
//       doc.setFontSize(14);
//       doc.text(newDocument.header, 10, yPosition);
//       yPosition += 15; // Space after header
//     }

//     // Draw a horizontal blue line above the Title and Header
//           doc.setDrawColor(0, 0, 255); // Set color to blue (RGB)
//           doc.setLineWidth(1); // Line width
//           doc.line(10, yPosition - 10, 200, yPosition - 10); // Draw horizontal line above header and title
//           yPosition += 2; // Space after the line

//           // Add the letter type (bold)
//           doc.setFont('times', 'bold');
//           doc.setFontSize(12);
//           doc.text("Letter Type: " + selectedLetterType, 10, yPosition);
//           yPosition += 10;

//     // Add the title (bold and larger font size)
//     doc.setFont('times', 'bold');
//     doc.setFontSize(12);
//     doc.text("Title: " + newDocument.title, 10, yPosition);
//     yPosition += 10;

//     // Add the main body (Details) with proper line breaks
//     const detailsText = stripTags(newDocument.details); // Remove HTML tags for clean text
//     const detailsLines = doc.splitTextToSize(detailsText, 180);

//     // Add an indentation for the body content
//     doc.setFont('times', 'normal');
//     for (let i = 0; i < detailsLines.length; i++) {
//       doc.text(detailsLines[i], 20, yPosition); // Indented by 10 for better readability
//       yPosition += 8; // Slightly tighter spacing between lines
//     }

//     // Add the applicable date section (bold label)
//     doc.setFont('times', 'bold');
//     doc.text("Applicable Date: " + newDocument.applicableDate, 10, yPosition);
//     yPosition += 10;

//     // Define footerY at the beginning for proper scoping
//     let footerY;

//     if (newDocument.footer) {
//       // Calculate footer Y position
//       footerY = doc.internal.pageSize.height - 20;
//       doc.setFont('times', 'italic');
//       doc.setFontSize(10);
//       doc.text(newDocument.footer, 10, footerY);
//     }

//     // Add a line separator (e.g., a dividing line before the footer)
//     if (newDocument.footer) {
//       doc.setLineWidth(0.5);
//       doc.line(10, footerY - 10, 200, footerY - 10); // Horizontal line just before the footer
//     }

//     // Output the PDF
//     const pdfDataUri = doc.output("datauristring");

//     // Handling file upload after PDF creation
//     const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
//       documentName: `${newDocument.title}`,
//     });

//     const blob = await fetch(pdfDataUri).then((res) => res.blob());
//     await uploadFile(signedUrlResponse.url, blob);

//       await axios.post(
//         `${process.env.REACT_APP_API}/route/org/adddocuments`,
//         {
//           hrid: Hrid,
//           managerId: managerId, // Send the managerId along with document data
//           empidd: selectedEmployee,
//           type: "Letter",
//           letterType: selectedLetterType, // Send the selected letter type
//           title: newDocument.title,
//           details: newDocument.details,
//           applicableDate: newDocument.applicableDate,
//           header: newDocument.header, // Send header to backend
//           footer: newDocument.footer, // Send footer to backend
//           url: signedUrlResponse.url.split("?")[0],
//         },
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       querClient.invalidateQueries("getOrgDocs");
//       setAppAlert({
//         alert: true,
//         type: "success",
//         msg: "Document Created Successfully",
//       });

//  // Reset all fields after successful creation
//  setNewDocument({
//   title: "",
//   details: "",
//   applicableDate: "",
//   header: "",
//   footer: "",
// });
// setSelectedEmployee(""); // Clear the selected employee
// setSelectedLetterType(""); // Clear the selected letter type

//       console.log("Document uploaded and data saved successfully");
//     } catch (error) {
//       console.error("Error while uploading document and saving data:", error);
//     }
//   };

//   const handleUpdateDocument = async () => {
//     try {

//       const doc = new jsPDF();
//       doc.setFontSize(12);
//       let yPosition = 20; // Initial Y position

//       // Add the header (with a larger font size for emphasis)
//       if (newDocument.header) {
//         doc.setFont('times', 'normal'); // Use a serif font for the header
//         doc.setFontSize(14);
//         doc.text(newDocument.header, 10, yPosition);
//         yPosition += 15; // Space after header
//       }

//       // Draw a horizontal blue line above the Title and Header
//             doc.setDrawColor(0, 0, 255); // Set color to blue (RGB)
//             doc.setLineWidth(1); // Line width
//             doc.line(10, yPosition - 10, 200, yPosition - 10); // Draw horizontal line above header and title
//             yPosition += 2; // Space after the line

//             // Add the letter type (bold)
//             doc.setFont('times', 'bold');
//             doc.setFontSize(12);
//             doc.text("Letter Type: " + selectedLetterType, 10, yPosition);
//             yPosition += 10;

//       // Add the title (bold and larger font size)
//       doc.setFont('times', 'bold');
//       doc.setFontSize(12);
//       doc.text("Title: " + newDocument.title, 10, yPosition);
//       yPosition += 10;

//       // Add the main body (Details) with proper line breaks
//       const detailsText = stripTags(newDocument.details); // Remove HTML tags for clean text
//       const detailsLines = doc.splitTextToSize(detailsText, 180);

//       // Add an indentation for the body content
//       doc.setFont('times', 'normal');
//       for (let i = 0; i < detailsLines.length; i++) {
//         doc.text(detailsLines[i], 20, yPosition); // Indented by 10 for better readability
//         yPosition += 8; // Slightly tighter spacing between lines
//       }

//       // Add the applicable date section (bold label)
//       doc.setFont('times', 'bold');
//       doc.text("Applicable Date: " + newDocument.applicableDate, 10, yPosition);
//       yPosition += 10;

//       // Define footerY at the beginning for proper scoping
//       let footerY;

//       if (newDocument.footer) {
//         // Calculate footer Y position
//         footerY = doc.internal.pageSize.height - 20;
//         doc.setFont('times', 'italic');
//         doc.setFontSize(10);
//         doc.text(newDocument.footer, 10, footerY);
//       }

//       // Add a line separator (e.g., a dividing line before the footer)
//       if (newDocument.footer) {
//         doc.setLineWidth(0.5);
//         doc.line(10, footerY - 10, 200, footerY - 10); // Horizontal line just before the footer
//       }

//       // Output the PDF
//       const pdfDataUri = doc.output("datauristring");

//       // Handling file upload after PDF creation
//       const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
//         documentName: `${newDocument.title}`,
//       });

//       const blob = await fetch(pdfDataUri).then((res) => res.blob());
//       await uploadFile(signedUrlResponse.url, blob);

//       const resp = await axios.patch(
//         `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
//         {
//           letterType: selectedLetterType,
//           header: newDocument.header, // Send header to backend
//           title: newDocument.title,
//           details: newDocument.details,
//           applicableDate: newDocument.applicableDate,
//           url: signedUrlResponse.url.split("?")[0],
//           footer: newDocument.footer, // Send footer to backend
//         },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log(resp);

//       querClient.invalidateQueries("getOrgDocs");
//       setAppAlert({
//         alert: true,
//         type: "success",
//         msg: "Document Updated Successfully",
//       });
//     } catch (error) {
//       console.error("Error while updating document:", error);
//     }
//   };

//   useEffect(() => {
//     if (savedEmployees.length === 1 && !selectedEmployee) {
//       const singleEmployee = savedEmployees[0];
//       setSelectedEmployee(singleEmployee._id); // Keep the employee ID
//       setManagerId(savedManagers[singleEmployee._id]); // Set the manager ID
//     }
//   }, [savedEmployees, selectedEmployee, savedManagers]);

//   return (
//     <div className="w-full h-full flex flex-col sm:flex-row justify-around  gap-6 bg-gray-50 min-h-screen">
//       {/* Left Section (Document List or Options) */}
//       <Container
//         className={`w-full ${
//           option === "emp" ? "sm:w-full" : "sm:w-1/2"
//         } h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-4`}
//       >
//         {option !== "" && (
//           <div
//             onClick={() => setOption("")}
//             className="w-[30px] h-[30px] cursor-pointer mb-2 rounded-full border-2"
//           >
//             <ArrowBackIcon />
//           </div>
//         )}

//         {option === "emp" && <DataTable />}
//         {option === "doc" && (
//           <DocList
//             onEdit={handleEditDocument}
//             onDelete={handleDeleteDoc}
//             data={data2}
//           />
//         )}
//         {option === "" && (
//           <div>
//             <p className="font-semibold">
//               Manage Organisational Records, Used For Generation And
//               Distribution of Information To The Employees.
//             </p>
//             <Options setOption={setOption} />
//           </div>
//         )}
//       </Container>

//       {/* Right Section (Document Form) */}
//       {option !== "emp" &&  (
//         <Container className="w-full sm:w-1/2 h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-6">
//           <div id="document-content">
//             <div
//               style={{ borderBottom: "2px solid gray" }}
//               className="w-full flex justify-center mb-6"
//             >
//               <Typography className="!font-semibold !text-xl">
//                 {docId ? "Update Record" : "Create Record"}
//               </Typography>
//             </div>

//             {/* Send To Field */}
//             <div className="mb-4">
//               <label
//                 htmlFor="sendTo"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Send To
//               </label>

//               <select
//                 id="sendTo"
//                 onChange={handleSelectEmployee}
//                 value={selectedEmployee} // This ensures the dropdown reflects the selected employee by ID
//                 className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="" disabled>
//                   Select an Employee
//                 </option>
//                 {savedEmployees.map((employee) => (
//                   <option key={employee._id} value={employee._id}>
//                     {employee.first_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Display selected employee's name */}
//             <div className="mb-4">
//               <TextField
//                 label="Send To"
//                 size="small"
//                 value={selectedEmployeeName}
//                 disabled
//                 fullWidth
//                 margin="normal"
//                 className="bg-gray-100"
//               />
//             </div>

//             {/* Select Dropdown */}
//             <div className="mb-4">
//               {/* Label for Letter Type */}
//               <label
//                 htmlFor="letterType"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Letter Type
//               </label>
//               <select
//                 id="letterType"
//                 value={selectedLetterType}
//                 onChange={handleSelectChange}
//                 className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="" disabled>
//                   Select a Letter Type
//                 </option>
//                 {letterTypes.map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="mb-4">
//               <TextField
//                 label="Header"
//                 size="small"
//                 value={newDocument.header || ""}
//                 onChange={(e) =>
//                   setNewDocument({ ...newDocument, header: e.target.value })
//                 }
//                 fullWidth
//                 margin="normal"
//                 className="bg-gray-100"
//               />

//               <div className="mb-4">
//                 <TextField
//                   label="Title"
//                   size="small"
//                   value={newDocument.title}
//                   onChange={(e) =>
//                     setNewDocument({ ...newDocument, title: e.target.value })
//                   }
//                   fullWidth
//                   margin="normal"
//                   className="bg-gray-100"
//                 />

//                 <div style={{ width: "100%", maxWidth: "668px" }}>
//                   <ReactQuill
//                     className="h-[280px] mb-9"
//                     theme="snow"
//                     value={newDocument.details}
//                     onChange={(value) =>
//                       setNewDocument({ ...newDocument, details: value })
//                     }
//                     modules={{
//                       toolbar: [
//                         [{ font: [] }],
//                         [{ header: [1, 2, 3, 4, 5, 6, false] }],
//                         ["bold", "italic", "underline", "strike"],
//                         [{ list: "ordered" }, { list: "bullet" }],
//                         ["link", "image"],
//                         [{ align: [] }],
//                         ["clean"],
//                       ],
//                     }}
//                     style={{ width: "100%" }}
//                   />
//                 </div>

//                 <TextField
//                   label="Footer"
//                   size="small"
//                   value={newDocument.footer || ""}
//                   onChange={(e) =>
//                     setNewDocument({ ...newDocument, footer: e.target.value })
//                   }
//                   fullWidth
//                   margin="normal"
//                   className="bg-gray-100"
//                 />
//               </div>

//               <TextField
//                 label="Applicable Date"
//                 size="small"
//                 type="date"
//                 value={newDocument.applicableDate}
//                 onChange={(e) =>
//                   setNewDocument({
//                     ...newDocument,
//                     applicableDate: e.target.value,
//                   })
//                 }
//                 fullWidth
//                 margin="normal"
//                 InputLabelProps={{ shrink: true }}
//                 inputProps={{
//                   min: new Date().toISOString().split("T")[0], // Prevent past dates
//                 }}
//                 className="bg-gray-100"
//               />
//             </div>
//           </div>

//           {/* Submit/Update Button Section */}
//           <div className="flex gap-2 mt-3 justify-center">
//             {!docId ? (
//               <Button
//                 variant="contained"
//                 size="small"
//                 onClick={handleCreateDocument}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
//               >
//                 Submit
//               </Button>
//             ) : (
//               <Button
//                 variant="contained"
//                 size="small"
//                 onClick={handleUpdateDocument}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
//               >
//                 Update
//               </Button>
//             )}
//           </div>
//         </Container>
//       )}
//     </div>
//   );
// };

// export default DocManageAuth;

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Container, TextField, Typography } from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import React, { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import stripTags from "striptags";
import { UseContext } from "../../State/UseState/UseContext";
import useGetUser from "../../hooks/Token/useUser";
import { getSignedUrlForOrgDocs, uploadFile } from "../../services/docManageS3";
import DataTable from "./components/DataTable";
import DocList from "./components/DocList";
import Options from "./components/Options";
import { useParams } from "react-router-dom";
import useLetterWorkflowStore from "./components/useletterworkflow";
import useEmployeeStore from "./components/useEmployeeStore";
import UserProfile from "../../hooks/UserData/useUser";

import { z } from "zod";

// Define the validation schema
const documentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  // details: z.string().min(1, "Details are required"),
   applicableDate: z.string().min(1, "Applicable date is required"),
  header: z.string().min(1, "Header is required"),
  footer: z.string().min(1, "Footer is required"),
  //  letterType: z.string().min(1, "Letter Type is required"),
});

const DocManageAuth = () => {
  const { authToken } = useGetUser();
  // to get current user information and user role
  const { getCurrentUser } = UserProfile();

  const user = getCurrentUser();
  console.log("user1111", user);
  const Hrid = user._id;
  const { organisationId } = useParams();
  const [option, setOption] = useState("");
  const querClient = useQueryClient();
  const [docId, setDocId] = useState("");
  const { setAppAlert } = useContext(UseContext);
  const [letterTypes, setLetterTypes] = useState([]);
  const [selectedLetterType, setSelectedLetterType] = useState(""); // Store the selected letter type
  // const [letterWorkflow, setLetterWorkflow] = useState({});
  const setLetterWorkflow = useLetterWorkflowStore(
    (state) => state.setLetterWorkflow
  );
  const [selectedEmployee, setSelectedEmployee] = useState("");
  // const [employeeId, setEmployeeId] = useState("");
  const [managerId, setManagerId] = useState("");
  const { savedEmployees } = useEmployeeStore(); // Get employees from Zustand
  const { savedManagers } = useEmployeeStore(); // Destructure savedManagers from the store

  const { data: data2 } = useQuery(`getOrgDocs`, async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/org/getdocs/letters`,
      {
        headers: { Authorization: authToken },
      }
    );

    return response.data.doc;
  });

  console.log(data2);

  const [newDocument, setNewDocument] = useState({
    header: "",
    footer: "",
    details: "",
    title: "",
    applicableDate: "",
  });
  console.log("type", newDocument);

  const handleSelectChange = (e) => {
    setSelectedLetterType(e.target.value); // Update the selected letter type
  };

  useEffect(() => {
    const fetchLetterWorkflow = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/letter/get/${organisationId}`,
          {
            headers: { Authorization: authToken },
          }
        );

        // Extract letter types and update Zustand store
        const fetchedLetterTypes = Object.keys(response.data);
        setLetterTypes(fetchedLetterTypes); // Save letter types for dropdown

        fetchedLetterTypes.forEach((letterType) => {
          const workflowStatus = response.data[letterType].workflow;
          setLetterWorkflow(letterType, workflowStatus);
        });
      } catch (error) {
        console.error("Error fetching letter workflow:", error);
        // Optionally, you could set an error state here to display a message to the user
      }
    };

    if (organisationId && authToken) {
      fetchLetterWorkflow();
    }
  }, [organisationId, authToken, setLetterWorkflow]); //

  const handleEditDocument = async (id) => {
    try {
      setDocId(id.toString());
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/org/getdoc/${id}`,
        {
          headers: { Authorization: authToken },
        }
      );
      const document = response.data.doc;
      console.log("Dc", document);
      // Convert the applicableDate to the 'YYYY-MM-DD' format
      const formattedDate = new Date(document.applicableDate)
        .toISOString()
        .split("T")[0];
      // Update the state with the formatted date
      setNewDocument({
        selectedLetterType: document.letterType, // Make sure this is set correctly
        header: document.header,
        title: document.title,
        details: document.details,
        applicableDate: formattedDate, // Set the formatted date here
        type: document.type,
        footer: document.footer,
      });
      // setNewDocument(response.data.doc);
    } catch (error) {
      console.error("Error while fetching document for editing:", error);
    }
  };

  const handleDeleteDoc = async (id) => {
    try {
      const resp = await axios.delete(
        `${process.env.REACT_APP_API}/route/org/deletedoc/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(resp);
      querClient.invalidateQueries("getOrgDocs");
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document Deleted Successfully",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setDocId("");
    setNewDocument({
      title: "",
      details: "",
      applicableDate: "",
    });
  }, [option]);

  const handleSelectEmployee = (e) => {
    const selectedEmployeeId = e.target.value;
    setSelectedEmployee(selectedEmployeeId); // Store employee's ID
    const managerId = savedManagers[selectedEmployeeId];
    setManagerId(managerId);
  };

  const selectedEmployeeName =
    savedEmployees.find((emp) => emp._id === selectedEmployee)?.first_name ||
    "";

  const handleCreateDocument = async () => {
    try {
      // Validate the document data
      const validatedData = documentSchema.parse(newDocument);
      console.log(validatedData);
      const doc = new jsPDF();
      doc.setFontSize(12);
      let yPosition = 20; // Initial Y position

      // Add the header (with a larger font size for emphasis)
      if (newDocument.header) {
        doc.setFont("times", "normal"); // Use a serif font for the header
        doc.setFontSize(14);
        doc.text(newDocument.header, 10, yPosition);
        yPosition += 15; // Space after header
      }

      // Draw a horizontal blue line above the Title and Header
      doc.setDrawColor(0, 0, 255); // Set color to blue (RGB)
      doc.setLineWidth(1); // Line width
      doc.line(10, yPosition - 10, 200, yPosition - 10); // Draw horizontal line above header and title
      yPosition += 2; // Space after the line

      // Add the letter type (bold)
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text("Letter Type: " + selectedLetterType, 10, yPosition);
      yPosition += 10;

      // Add the title (bold and larger font size)
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text("Title: " + newDocument.title, 10, yPosition);
      yPosition += 10;

      // Add the main body (Details) with proper line breaks
      const detailsText = stripTags(newDocument.details); // Remove HTML tags for clean text
      const detailsLines = doc.splitTextToSize(detailsText, 180);

      // Add an indentation for the body content
      doc.setFont("times", "normal");
      for (let i = 0; i < detailsLines.length; i++) {
        doc.text(detailsLines[i], 20, yPosition); // Indented by 10 for better readability
        yPosition += 8; // Slightly tighter spacing between lines
      }

      // Add the applicable date section (bold label)
      doc.setFont("times", "bold");
      doc.text("Applicable Date: " + newDocument.applicableDate, 10, yPosition);
      yPosition += 10;

      // Define footerY at the beginning for proper scoping
      let footerY;

      if (newDocument.footer) {
        // Calculate footer Y position
        footerY = doc.internal.pageSize.height - 20;
        doc.setFont("times", "italic");
        doc.setFontSize(10);
        doc.text(newDocument.footer, 10, footerY);
      }

      // Add a line separator (e.g., a dividing line before the footer)
      if (newDocument.footer) {
        doc.setLineWidth(0.5);
        doc.line(10, footerY - 10, 200, footerY - 10); // Horizontal line just before the footer
      }

      // Output the PDF
      const pdfDataUri = doc.output("datauristring");

      // Handling file upload after PDF creation
      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `${newDocument.title}`,
      });

      const blob = await fetch(pdfDataUri).then((res) => res.blob());
      await uploadFile(signedUrlResponse.url, blob);

      await axios.post(
        `${process.env.REACT_APP_API}/route/org/adddocuments`,
        {
          hrid: Hrid,
          managerId: managerId, // Send the managerId along with document data
          empidd: selectedEmployee,
          type: "Letter",
          letterType: selectedLetterType, // Send the selected letter type
          title: newDocument.title,
          details: newDocument.details,
          applicableDate: newDocument.applicableDate,
          header: newDocument.header, // Send header to backend
          footer: newDocument.footer, // Send footer to backend
          url: signedUrlResponse.url.split("?")[0],
        },
        {
          headers: { Authorization: authToken },
        }
      );
      querClient.invalidateQueries("getOrgDocs");
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document Created Successfully",
      });

      // Reset all fields after successful creation
      setNewDocument({
        title: "",
        details: "",
        applicableDate: "",
        header: "",
        footer: "",
      });
      setSelectedEmployee(""); // Clear the selected employee
      setSelectedLetterType(""); // Clear the selected letter type

      console.log("Document uploaded and data saved successfully");
    } 
    catch (error) {
      if (error instanceof z.ZodError) {
        // If validation fails, handle errors
        console.log("errorzod",error)
        error.errors.forEach((err) => {
          setAppAlert({
            alert: true,
            type: "error",
            msg: err.message,
          });
        });
      } else {
        console.error("Error while uploading document and saving data:", error);
      }
    }
  };

  const handleUpdateDocument = async () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(12);
      let yPosition = 20; // Initial Y position

      // Add the header (with a larger font size for emphasis)
      if (newDocument.header) {
        doc.setFont("times", "normal"); // Use a serif font for the header
        doc.setFontSize(14);
        doc.text(newDocument.header, 10, yPosition);
        yPosition += 15; // Space after header
      }

      // Draw a horizontal blue line above the Title and Header
      doc.setDrawColor(0, 0, 255); // Set color to blue (RGB)
      doc.setLineWidth(1); // Line width
      doc.line(10, yPosition - 10, 200, yPosition - 10); // Draw horizontal line above header and title
      yPosition += 2; // Space after the line

      // Add the letter type (bold)
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text("Letter Type: " + selectedLetterType, 10, yPosition);
      yPosition += 10;

      // Add the title (bold and larger font size)
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text("Title: " + newDocument.title, 10, yPosition);
      yPosition += 10;

      // Add the main body (Details) with proper line breaks
      const detailsText = stripTags(newDocument.details); // Remove HTML tags for clean text
      const detailsLines = doc.splitTextToSize(detailsText, 180);

      // Add an indentation for the body content
      doc.setFont("times", "normal");
      for (let i = 0; i < detailsLines.length; i++) {
        doc.text(detailsLines[i], 20, yPosition); // Indented by 10 for better readability
        yPosition += 8; // Slightly tighter spacing between lines
      }

      // Add the applicable date section (bold label)
      doc.setFont("times", "bold");
      doc.text("Applicable Date: " + newDocument.applicableDate, 10, yPosition);
      yPosition += 10;

      // Define footerY at the beginning for proper scoping
      let footerY;

      if (newDocument.footer) {
        // Calculate footer Y position
        footerY = doc.internal.pageSize.height - 20;
        doc.setFont("times", "italic");
        doc.setFontSize(10);
        doc.text(newDocument.footer, 10, footerY);
      }

      // Add a line separator (e.g., a dividing line before the footer)
      if (newDocument.footer) {
        doc.setLineWidth(0.5);
        doc.line(10, footerY - 10, 200, footerY - 10); // Horizontal line just before the footer
      }

      // Output the PDF
      const pdfDataUri = doc.output("datauristring");

      // Handling file upload after PDF creation
      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `${newDocument.title}`,
      });

      const blob = await fetch(pdfDataUri).then((res) => res.blob());
      await uploadFile(signedUrlResponse.url, blob);

      const resp = await axios.patch(
        `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
        {
          letterType: selectedLetterType,
          header: newDocument.header, // Send header to backend
          title: newDocument.title,
          details: newDocument.details,
          applicableDate: newDocument.applicableDate,
          url: signedUrlResponse.url.split("?")[0],
          footer: newDocument.footer, // Send footer to backend
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(resp);

      querClient.invalidateQueries("getOrgDocs");
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document Updated Successfully",
      });
    } catch (error) {
      console.error("Error while updating document:", error);
    }
  };

  useEffect(() => {
    if (savedEmployees.length === 1 && !selectedEmployee) {
      const singleEmployee = savedEmployees[0];
      setSelectedEmployee(singleEmployee._id); // Keep the employee ID
      setManagerId(savedManagers[singleEmployee._id]); // Set the manager ID
    }
  }, [savedEmployees, selectedEmployee, savedManagers]);

  return (
    <div className="w-full h-full flex flex-col sm:flex-row justify-around  gap-6 bg-gray-50 min-h-screen">
      {/* Left Section (Document List or Options) */}
      <Container
        className={`w-full ${
          option === "emp" ? "sm:w-full" : "sm:w-1/2"
        } h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-4`}
      >
        {option !== "" && (
          <div
            onClick={() => setOption("")}
            className="w-[30px] h-[30px] cursor-pointer mb-2 rounded-full border-2"
          >
            <ArrowBackIcon />
          </div>
        )}

        {option === "emp" && <DataTable />}
        {option === "doc" && (
          <DocList
            onEdit={handleEditDocument}
            onDelete={handleDeleteDoc}
            data={data2}
          />
        )}
        {option === "" && (
          <div>
            <p className="font-semibold">
              Manage Organisational Records, Used For Generation And
              Distribution of Information To The Employees.
            </p>
            <Options setOption={setOption} />
          </div>
        )}
      </Container>

      {/* Right Section (Document Form) */}
      {option !== "emp" && (
        <Container className="w-full sm:w-1/2 h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-6">
          <div id="document-content">
            <div
              style={{ borderBottom: "2px solid gray" }}
              className="w-full flex justify-center mb-6"
            >
              <Typography className="!font-semibold !text-xl">
                {docId ? "Update Record" : "Create Record"}
              </Typography>
            </div>

            {/* Send To Field */}
            <div className="mb-4">
              <label
                htmlFor="sendTo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Send To
              </label>

              <select
                id="sendTo"
                onChange={handleSelectEmployee}
                value={selectedEmployee} // This ensures the dropdown reflects the selected employee by ID
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>
                  Select an Employee
                </option>
                {savedEmployees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.first_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Display selected employee's name */}
            <div className="mb-4">
              <TextField
                label="Send To"
                size="small"
                value={selectedEmployeeName}
                disabled
                fullWidth
                margin="normal"
                className="bg-gray-100"
              />
            </div>

            {/* Select Dropdown */}
            <div className="mb-4">
              {/* Label for Letter Type */}
              <label
                htmlFor="letterType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Letter Type
              </label>
              <select
                id="letterType"
                value={selectedLetterType}
                onChange={handleSelectChange}
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>
                  Select a Letter Type
                </option>
                {letterTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <TextField
                label="Header"
                size="small"
                value={newDocument.header || ""}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, header: e.target.value })
                }
                fullWidth
                margin="normal"
                className="bg-gray-100"
              />

              <div className="mb-4">
                <TextField
                  label="Title"
                  size="small"
                  value={newDocument.title}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, title: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                  className="bg-gray-100"
                />

                <div style={{ width: "100%", maxWidth: "668px" }}>
                  <ReactQuill
                    className="h-[280px] mb-9"
                    theme="snow"
                    value={newDocument.details}
                    onChange={(value) =>
                      setNewDocument({ ...newDocument, details: value })
                    }
                    modules={{
                      toolbar: [
                        [{ font: [] }],
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image"],
                        [{ align: [] }],
                        ["clean"],
                      ],
                    }}
                    style={{ width: "100%" }}
                  />
                </div>

                <TextField
                  label="Footer"
                  size="small"
                  value={newDocument.footer || ""}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, footer: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                  className="bg-gray-100"
                />
              </div>

              <TextField
                label="Applicable Date"
                size="small"
                type="date"
                value={newDocument.applicableDate}
                onChange={(e) =>
                  setNewDocument({
                    ...newDocument,
                    applicableDate: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().split("T")[0], // Prevent past dates
                }}
                className="bg-gray-100"
              />
            </div>
          </div>

          {/* Submit/Update Button Section */}
          <div className="flex gap-2 mt-3 justify-center">
            {!docId ? (
              <Button
                variant="contained"
                size="small"
                onClick={handleCreateDocument}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={handleUpdateDocument}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
              >
                Update
              </Button>
            )}
          </div>
        </Container>
      )}
    </div>
  );
};

export default DocManageAuth;
