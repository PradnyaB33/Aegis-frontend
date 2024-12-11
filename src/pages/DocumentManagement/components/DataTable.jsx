/* eslint-disable no-unused-vars */
// import {
//   Button,Checkbox,FormControl,FormControlLabel,InputLabel,MenuItem,Select,Table,TableBody,TableCell,TableContainer,TableHead,
//   TableRow,
//   TextField,
// } from "@mui/material";
// import axios from "axios";
// import React, { useContext, useEffect, useState } from "react";
// import { UseContext } from "../../../State/UseState/UseContext";
// import useGetUser from "../../../hooks/Token/useUser";
// import UserProfile from "../../../hooks/UserData/useUser";

// const DataTable = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
//   const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
//   const [data1, setData1] = useState([]);
//   const [employeeData, setEmployeeData] = useState([]);
//   const [managerArray, setManagerArray] = useState([]);
//   const [initialEmployeeData, setInitialEmployeeData] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [documents, setDocuments] = useState([]);
//   const [selectedDocumentId, setSelectedDocumentId] = useState("");
//   const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
//   const [selectedMDocId, setSelectedMDocId] = useState("");
//   const [managerIds, setManagerIds] = useState([]);
//   const [showManagerSelect, setShowManagerSelect] = useState(false); // State to track checkbox status
//   const { setAppAlert } = useContext(UseContext);
//   const [selectAll, setSelectAll] = useState(false);
//   const { useGetCurrentRole } = UserProfile();
//   const role = useGetCurrentRole();
//   const authToken = useGetUser().authToken;

//   const handleSelectAllClick = async (event) => {
//     const checked = event.target.checked;
//     setSelectAll(checked);

//     if (checked) {
//       const allEmployeeIds = employeeData.map((employee) => employee._id);
//       setSelectedEmployeeIds(allEmployeeIds);

//       try {
//         const managerIdPromises = allEmployeeIds.map(async (empId) => {
//           try {
//             const managerResponse = await axios.get(
//               `${process.env.REACT_APP_API}/route/org/getManager/${empId}`,
//               {
//                 headers: {
//                   Authorization: authToken,
//                 },
//               }
//             );
//             return managerResponse.data.id;
//           } catch (error) {
//             console.error("Error fetching manager for employee", empId, error);
//             return null;
//           }
//         });

//         const managerIds = await Promise.all(managerIdPromises);
//         console.log("Manager IDs for selected employees:", managerIds);

//         setManagerIds(managerIds);
//       } catch (error) {
//         console.error("Error fetching manager IDs:", error);
//       }
//     } else {
//       setSelectedEmployeeIds([]);
//       setManagerIds([]);
//     }
//   };

//   useEffect(() => {
//     console.log(selectedEmployeeIds);
//     console.log(managerIds);
//     // eslint-disable-next-line
//   }, [selectedEmployeeIds]);

//   const handleEmployeeSelection = async (event, id) => {
//     const selectedIndex = selectedEmployeeIds.indexOf(id);
//     let newSelected = [...selectedEmployeeIds];

//     if (selectedIndex === -1) {
//       newSelected.push(id);
//     } else {
//       newSelected.splice(selectedIndex, 1);
//     }

//     setSelectedEmployeeIds(newSelected);
//     setSelectAll(newSelected.length === employeeData.length);
//     console.log("Selected Employee IDs:", newSelected);

//     try {
//       const managerIdPromises = newSelected.map(async (empId) => {
//         try {
//           const managerResponse = await axios.get(
//             `${process.env.REACT_APP_API}/route/org/getManager/${empId}`,
//             {
//               headers: {
//                 Authorization: authToken,
//               },
//             }
//           );
//           return managerResponse.data.id;
//         } catch (error) {
//           console.error("Error fetching manager for employee", empId, error);
//           return null;
//         }
//       });

//       const managerIds = await Promise.all(managerIdPromises);
//       console.log("Manager IDs for selected employees:", managerIds);

//       setManagerIds(managerIds);
//     } catch (error) {
//       console.error("Error fetching manager IDs:", error);
//     }
//   };

//   const isSelected = (id) => selectedEmployeeIds.indexOf(id) !== -1;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let response;
//         if (role === "HR") {
//           response = await axios.get(
//             `${process.env.REACT_APP_API}/route/organization/getOneOrgHr`,
//             {
//               headers: { Authorization: authToken },
//             }
//           );
//           setData1(response.data.orgData);
//           setSelectedOrganizationId(response.data.orgData._id)
//           return response;
//         }
//         response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/getall`,
//           {
//             headers: { Authorization: authToken },
//           }
//         );
//         setData1(response.data.orgData);
//       } catch (error) {
//         console.error("Error fetching organizations: ", error);
//       }
//     };

//     fetchData();
//     // eslint-disable-next-line
//   }, [authToken]);

//   console.log("this is the data1", data1);

//   useEffect(() => {
//     (async () => {
//       const resp = await axios.get(
//         `${process.env.REACT_APP_API}/route/org/getmanagers`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log("manager", resp.data.filteredManagers);
//       setManagerArray(resp.data.filteredManagers);
//     })();
//     // eslint-disable-next-line
//   }, []);

//   const fetchEmployees = async (orgId) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/employee/get/${orgId}`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       setEmployeeData(response.data.employees);
//       setInitialEmployeeData(response.data.employees);
//     } catch (error) {
//       console.error("Error fetching employees: ", error);
//     }
//   };

//   const fetchDepartments = async (orgId) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/department/getall/${orgId}`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       setDepartments(response.data.getOrgs);
//       console.log("Department List: ",response.data.getOrgs)
//     } catch (error) {
//       console.error("Error fetching departments: ", error);
//     }
//   };

//   useEffect(() => {
//     if (selectedOrganizationId) {
//       fetchEmployees(selectedOrganizationId);
//       fetchDepartments(selectedOrganizationId);
//     }

//     // eslint-disable-next-line
//   }, [selectedOrganizationId, authToken , data1]);

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/org/getdocs`,
//           {
//             headers: { Authorization: authToken },
//           }
//         );
//         setDocuments(response.data.doc);
//       } catch (error) {
//         console.error("Error fetching documents: ", error);
//       }
//     };

//     fetchDocuments();
//   }, [authToken]);

//   const handleSearchChange = (event) => {
//     const query = event.target.value.toLowerCase();
//     setSearchQuery(query);
//     const filteredEmployees = initialEmployeeData.filter((employee) => {
//       return (
//         employee.first_name.toLowerCase().includes(query) ||
//         employee.last_name.toLowerCase().includes(query)
//       );
//     });
//     setEmployeeData(filteredEmployees);
//   };

//   const handleOrganizationChange = (event) => {
//     const orgId = event.target.value;
//     setSelectedOrganizationId(orgId);
//     fetchDepartments(orgId);
//     setSelectedDepartmentId("");
//   };

//   const handleDepartmentChange = (event) => {
//     const deptId = event.target.value;
//     setSelectedDepartmentId(deptId);
//     const filteredEmployees = initialEmployeeData.filter((employee) => {
//       return employee?.deptname?.[0] === deptId;
//     });
//     setEmployeeData(filteredEmployees);
//   };

//   const handleDocumentChange = (event) => {
//     const docId = event.target.value;
//     setSelectedDocumentId(docId);
//     console.log("Selected Document ID:", docId);
//   };
//   const handleDocumentChange2 = (event) => {
//     const mDocId = event.target.value;
//     setSelectedMDocId(mDocId);
//     console.log("Selected MDocument ID:", mDocId);
//     setEmployeeData(managerArray[mDocId].reporteeIds);
//   };

//   const handleSendButtonClick = async () => {
//     try {
//       const employeeIds = selectedEmployeeIds.map((id) => {
//         const managerId = managerIds[selectedEmployeeIds.indexOf(id)];
//         return {
//           empId: id,
//           mId: managerId ? managerId : null,
//           status: managerId ? false : true,
//         };
//       });

//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/org/updatearr/${selectedDocumentId}`,
//         {
//           employeeId: employeeIds,
//         },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log(response);
//       setAppAlert({
//         alert: true,
//         type: "success",
//         msg: "Document is sent successfully",
//       });
//     } catch (error) {
//       setAppAlert({
//         alert: true,
//         type: "error",
//         msg: "Please select the document first",
//       });
//     }
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <div className="flex gap-4">
//         <FormControl size="small" style={{ width: 200 }}>
//           <FormControlLabel
//             className="!text-xs"
//             control={
//               <Checkbox
//                 checked={showManagerSelect}
//                 onChange={() => setShowManagerSelect(!showManagerSelect)}
//                 color="primary"
//               />
//             }
//             label="Downcast"
//           />
//         </FormControl>

//         {data1.length > 0 && (
//           <FormControl size="small" style={{ width: 200 }}>
//             <InputLabel id="organization-label">Select Organization</InputLabel>
//             <Select
//               label="Select organization"
//               name="type"
//               onChange={handleOrganizationChange}
//             >
//               {data1.map((org) => (
//                 <MenuItem key={org._id} value={org._id}>
//                   {org.orgName}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}
//         <FormControl size="small" style={{ width: 200 }}>
//           <InputLabel id="department-label">Select Department</InputLabel>
//           <Select
//             label="Select department"
//             name="type"
//             onChange={handleDepartmentChange}
//             value={selectedDepartmentId}
//           >
//             {departments.length === 0 ? (
//               <MenuItem value="">No Departments Found</MenuItem>
//             ) : (
//               departments?.map((dept) => (
//                 <MenuItem key={dept._id} value={dept._id}>
//                   {dept?.departmentName}
//                 </MenuItem>
//               ))
//             )}
//           </Select>
//         </FormControl>

//         <TextField
//           label="Search Employee"
//           variant="outlined"
//           size="small"
//           value={searchQuery}
//           onChange={handleSearchChange}
//         />

//         {/* Select field for documents */}
//         <FormControl size="small" style={{ width: 200 }}>
//           <InputLabel id="document-label">Select Document</InputLabel>
//           <Select
//             label="Select document"
//             name="document"
//             onChange={handleDocumentChange}
//             value={selectedDocumentId}
//           >
//             {documents.map((doc) => (
//               <MenuItem key={doc._id} value={doc._id}>
//                 {doc.title}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {showManagerSelect && (
//           <FormControl size="small" style={{ width: 200 }}>
//             <InputLabel id="document-label">Select Manager</InputLabel>
//             <Select
//               label="Select Manager"
//               name="document"
//               onChange={handleDocumentChange2}
//               value={selectedMDocId}
//             >
//               {managerArray?.map((doc, idx) => (
//                 <MenuItem key={doc._id} value={idx}>
//                   {doc.managerId?.first_name &&
//                     doc.managerId?.last_name &&
//                     doc.managerId?.first_name + " " + doc.managerId?.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}
//       </div>
//       <div style={{ width: "100%", overflowY: "auto", maxHeight: "450px" }}>
//         {employeeData.length === 0 ? (
//           <p className="text-center font-semibold">no employee available</p>
//         ) : (
//           <TableContainer className=" pt-3">
//             <Table className="min-w-full bg-white text-left !text-sm font-light ">
//               <TableHead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//                 <TableRow className= "!font-semibold">
//                   <TableCell padding="checkbox">
//                     <Checkbox
//                       checked={selectAll}
//                       onChange={handleSelectAllClick}
//                     />
//                   </TableCell>
//                   <TableCell className= "!font-semibold">Sr.No</TableCell>
//                   <TableCell className= "!font-semibold">First Name</TableCell>
//                   <TableCell className= "!font-semibold">Last Name</TableCell>
//                   <TableCell className= "!font-semibold">Employee Id</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {employeeData?.map((employee, idx) => {
//                   const isItemSelected = isSelected(employee._id);
//                   return (
//                     <TableRow
//                       key={employee._id}
//                       hover
//                       onClick={(event) =>
//                         handleEmployeeSelection(event, employee._id)
//                       }
//                       role="checkbox"
//                       aria-checked={isItemSelected}
//                       selected={isItemSelected}
//                     >
//                       <TableCell padding="checkbox">
//                         <Checkbox checked={isItemSelected} />
//                       </TableCell>
//                       <TableCell>{idx + 1}</TableCell>
//                       <TableCell>{employee.first_name}</TableCell>
//                       <TableCell>{employee.last_name}</TableCell>
//                       <TableCell>{employee.empId}</TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//         <div style={{ position: "absolute", bottom: -30, width: "100%" }}>
//           {employeeData.length === 0 ? (
//             ""
//           ) : (
//             <Button
//               size="small"
//               onClick={handleSendButtonClick}
//               variant="contained"
//               style={{ float: "left" }}
//             >
//               Send
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;

// import {
//   Button,
//   Checkbox,
//   FormControl,
//   FormControlLabel,
//   InputLabel,
//   MenuItem,
//   Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
// } from "@mui/material";
// import axios from "axios";
// import React, { useContext, useEffect, useState } from "react";
// import { UseContext } from "../../../State/UseState/UseContext";
// import useGetUser from "../../../hooks/Token/useUser";
// import UserProfile from "../../../hooks/UserData/useUser";
// import useEmployeeStore from "./useEmployeeStore";

// const DataTable = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
//   const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
//   const [data1, setData1] = useState([]);
//   const [employeeData, setEmployeeData] = useState([]);
//   const [managerArray, setManagerArray] = useState([]);
//   const [initialEmployeeData, setInitialEmployeeData] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [documents, setDocuments] = useState([]);
//   const [selectedDocumentId, setSelectedDocumentId] = useState("");
//   const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
//   const [selectedMDocId, setSelectedMDocId] = useState("");
//   const [managerIds, setManagerIds] = useState([]);
//   const [showManagerSelect, setShowManagerSelect] = useState(false); // State to track checkbox status
//   const { setAppAlert } = useContext(UseContext);
//   const [selectAll, setSelectAll] = useState(false);
//   const { useGetCurrentRole } = UserProfile();
//   const role = useGetCurrentRole();
//   const authToken = useGetUser().authToken;
//   const { savedEmployees, savedManagers,addEmployee, removeEmployee, clearEmployees } =
//     useEmployeeStore();

//   const handleSelectAllClick = async (event) => {
//     const checked = event.target.checked;
//     setSelectAll(checked);

//     if (checked) {

//       const allEmployeeIds = employeeData.map((employee) => employee._id);
//       setSelectedEmployeeIds(allEmployeeIds);

//       try {
//         const managerIdPromises = allEmployeeIds.map(async (empId) => {
//           try {
//             const managerResponse = await axios.get(
//               `${process.env.REACT_APP_API}/route/org/getManager/${empId}`,
//               {
//                 headers: {
//                   Authorization: authToken,
//                 },
//               }
//             );
//             return managerResponse.data.id;
//           } catch (error) {
//             console.error("Error fetching manager for employee", empId, error);
//             return null;
//           }
//         });

//         const managerIds = await Promise.all(managerIdPromises);
//         console.log("Manager IDs for selected employees:", managerIds);

//         setManagerIds(managerIds);

//             // Add employees with manager IDs to Zustand
//       employeeData.forEach((employee, index) => {
//         const managerId = managerIds[index] || null;
//         addEmployee(employee, managerId);
//       });

//       } catch (error) {
//         console.error("Error fetching manager IDs:", error);
//       }
//     } else {
//       setSelectedEmployeeIds([]);
//       setManagerIds([]);
//       clearEmployees(); // Clear all from Zustand store
//     }
//   };

//   useEffect(() => {
//     console.log(selectedEmployeeIds);
//     console.log(managerIds);
//     // eslint-disable-next-line
//   }, [selectedEmployeeIds]);

//   const handleEmployeeSelection = async (event, id) => {
//     const selectedIndex = selectedEmployeeIds.indexOf(id);
//     let newSelected = [...selectedEmployeeIds];

//     if (selectedIndex === -1) {
//       newSelected.push(id);

//     } else {
//       newSelected.splice(selectedIndex, 1);
//       removeEmployee(id); // Remove from Zustand store
//     }

//     setSelectedEmployeeIds(newSelected);
//     setSelectAll(newSelected.length === employeeData.length);
//     console.log("Selected Employee IDs:", newSelected);

//     try {
//       const managerIdPromises = newSelected.map(async (empId) => {
//         try {
//           const managerResponse = await axios.get(
//             `${process.env.REACT_APP_API}/route/org/getManager/${empId}`,
//             {
//               headers: {
//                 Authorization: authToken,
//               },
//             }
//           );
//           return managerResponse.data.id;
//         } catch (error) {
//           console.error("Error fetching manager for employee", empId, error);
//           return null;
//         }
//       });

//       const managerIds = await Promise.all(managerIdPromises);
//       console.log("Manager IDs for selected employees:", managerIds);

//       setManagerIds(managerIds);
//          // Add to Zustand
//          const employee = employeeData.find((emp) => emp._id === id);
//          addEmployee(employee, managerIds);
//     } catch (error) {
//       console.error("Error fetching manager IDs:", error);
//     }
//   };

//   const isSelected = (id) => selectedEmployeeIds.indexOf(id) !== -1;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let response;
//         if (role === "HR") {
//           response = await axios.get(
//             `${process.env.REACT_APP_API}/route/organization/getOneOrgHr`,
//             {
//               headers: { Authorization: authToken },
//             }
//           );
//           setData1(response.data.orgData);
//           setSelectedOrganizationId(response.data.orgData._id);
//           return response;
//         }
//         response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/getall`,
//           {
//             headers: { Authorization: authToken },
//           }
//         );
//         setData1(response.data.orgData);
//       } catch (error) {
//         console.error("Error fetching organizations: ", error);
//       }
//     };

//     fetchData();
//     // eslint-disable-next-line
//   }, [authToken]);

//   console.log("this is the data1", data1);

//   useEffect(() => {
//     (async () => {
//       const resp = await axios.get(
//         `${process.env.REACT_APP_API}/route/org/getmanagers`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log("manager", resp.data.filteredManagers);
//       setManagerArray(resp.data.filteredManagers);
//     })();
//     // eslint-disable-next-line
//   }, []);

//   const fetchEmployees = async (orgId) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/employee/get/${orgId}`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       setEmployeeData(response.data.employees);
//       setInitialEmployeeData(response.data.employees);
//     } catch (error) {
//       console.error("Error fetching employees: ", error);
//     }
//   };

//   const fetchDepartments = async (orgId) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/department/getall/${orgId}`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       setDepartments(response.data.getOrgs);
//       console.log("Department List: ", response.data.getOrgs);
//     } catch (error) {
//       console.error("Error fetching departments: ", error);
//     }
//   };

//   useEffect(() => {
//     if (selectedOrganizationId) {
//       fetchEmployees(selectedOrganizationId);
//       fetchDepartments(selectedOrganizationId);
//     }

//     // eslint-disable-next-line
//   }, [selectedOrganizationId, authToken, data1]);

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/org/getdocs`,
//           {
//             headers: { Authorization: authToken },
//           }
//         );
//         setDocuments(response.data.doc);
//       } catch (error) {
//         console.error("Error fetching documents: ", error);
//       }
//     };

//     fetchDocuments();
//   }, [authToken]);

//   const handleSearchChange = (event) => {
//     const query = event.target.value.toLowerCase();
//     setSearchQuery(query);
//     const filteredEmployees = initialEmployeeData.filter((employee) => {
//       return (
//         employee.first_name.toLowerCase().includes(query) ||
//         employee.last_name.toLowerCase().includes(query)
//       );
//     });
//     setEmployeeData(filteredEmployees);
//   };

//   const handleOrganizationChange = (event) => {
//     const orgId = event.target.value;
//     setSelectedOrganizationId(orgId);
//     fetchDepartments(orgId);
//     setSelectedDepartmentId("");
//   };

//   const handleDepartmentChange = (event) => {
//     const deptId = event.target.value;
//     setSelectedDepartmentId(deptId);
//     const filteredEmployees = initialEmployeeData.filter((employee) => {
//       return employee?.deptname?.[0] === deptId;
//     });
//     setEmployeeData(filteredEmployees);
//   };

//   const handleDocumentChange = (event) => {
//     const docId = event.target.value;
//     setSelectedDocumentId(docId);
//     console.log("Selected Document ID:", docId);
//   };

//   const handleDocumentChange2 = (event) => {
//     const mDocId = event.target.value;
//     setSelectedMDocId(mDocId);
//     console.log("Selected MDocument ID:", mDocId);
//     setEmployeeData(managerArray[mDocId].reporteeIds);
//   };

//   const handleSendButtonClick = async () => {
//     try {
//       const employeeIds = selectedEmployeeIds.map((id) => {
//         const managerId = managerIds[selectedEmployeeIds.indexOf(id)];
//         return {
//           empId: id,
//           mId: managerId ? managerId : null,
//           status: managerId ? false : true,
//         };
//       });

//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/org/updatearr/${selectedDocumentId}`,
//         {
//           employeeId: employeeIds,
//         },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log(response);
//       setAppAlert({
//         alert: true,
//         type: "success",
//         msg: "Document is sent successfully",
//       });
//     } catch (error) {
//       setAppAlert({
//         alert: true,
//         type: "error",
//         msg: "Please select the document first",
//       });
//     }
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <div className="flex gap-4">
//         <FormControl size="small" style={{ width: 200 }}>
//           <FormControlLabel
//             className="!text-xs"
//             control={
//               <Checkbox
//                 checked={showManagerSelect}
//                 onChange={() => setShowManagerSelect(!showManagerSelect)}
//                 color="primary"
//               />
//             }
//             label="Downcast"
//           />
//         </FormControl>

//         {data1.length > 0 && (
//           <FormControl size="small" style={{ width: 200 }}>
//             <InputLabel id="organization-label">Select Organization</InputLabel>
//             <Select
//               label="Select organization"
//               name="type"
//               onChange={handleOrganizationChange}
//             >
//               {data1.map((org) => (
//                 <MenuItem key={org._id} value={org._id}>
//                   {org.orgName}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}
//         <FormControl size="small" style={{ width: 200 }}>
//           <InputLabel id="department-label">Select Department</InputLabel>
//           <Select
//             label="Select department"
//             name="type"
//             onChange={handleDepartmentChange}
//             value={selectedDepartmentId}
//           >
//             {departments.length === 0 ? (
//               <MenuItem value="">No Departments Found</MenuItem>
//             ) : (
//               departments?.map((dept) => (
//                 <MenuItem key={dept._id} value={dept._id}>
//                   {dept?.departmentName}
//                 </MenuItem>
//               ))
//             )}
//           </Select>
//         </FormControl>

//         <TextField
//           label="Search Employee"
//           variant="outlined"
//           size="small"
//           value={searchQuery}
//           onChange={handleSearchChange}
//         />

//         {/* Select field for documents */}
//         <FormControl size="small" style={{ width: 200 }}>
//           <InputLabel id="document-label">Select Document</InputLabel>
//           <Select
//             label="Select document"
//             name="document"
//             onChange={handleDocumentChange}
//             value={selectedDocumentId}
//           >
//             {documents.map((doc) => (
//               <MenuItem key={doc._id} value={doc._id}>
//                 {doc.title}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {showManagerSelect && (
//           <FormControl size="small" style={{ width: 200 }}>
//             <InputLabel id="document-label">Select Manager</InputLabel>
//             <Select
//               label="Select Manager"
//               name="document"
//               onChange={handleDocumentChange2}
//               value={selectedMDocId}
//             >
//               {managerArray?.map((doc, idx) => (
//                 <MenuItem key={doc._id} value={idx}>
//                   {doc.managerId?.first_name &&
//                     doc.managerId?.last_name &&
//                     doc.managerId?.first_name + " " + doc.managerId?.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}
//       </div>
//       <div style={{ width: "100%", overflowY: "auto", maxHeight: "450px" }}>
//         {employeeData.length === 0 ? (
//           <p className="text-center font-semibold">no employee available</p>
//         ) : (
//           <TableContainer className=" pt-3">
//             <Table className="min-w-full bg-white text-left !text-sm font-light ">
//               <TableHead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//                 <TableRow className="!font-semibold">
//                   <TableCell padding="checkbox">
//                     <Checkbox
//                       checked={selectAll}
//                       onChange={handleSelectAllClick}
//                     />
//                   </TableCell>
//                   <TableCell className="!font-semibold">Sr.No</TableCell>
//                   <TableCell className="!font-semibold">First Name</TableCell>
//                   <TableCell className="!font-semibold">Last Name</TableCell>
//                   <TableCell className="!font-semibold">Employee Id</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {employeeData?.map((employee, idx) => {
//                   const isItemSelected = isSelected(employee._id);
//                   return (
//                     <TableRow
//                       key={employee._id}
//                       hover
//                       onClick={(event) =>
//                         handleEmployeeSelection(event, employee._id)
//                       }
//                       role="checkbox"
//                       aria-checked={isItemSelected}
//                       selected={isItemSelected}
//                     >
//                       <TableCell padding="checkbox">
//                         <Checkbox checked={isItemSelected} />
//                       </TableCell>
//                       <TableCell>{idx + 1}</TableCell>
//                       <TableCell>{employee.first_name}</TableCell>
//                       <TableCell>{employee.last_name}</TableCell>
//                       <TableCell>{employee.empId}</TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//         <div style={{ position: "absolute", bottom: -30, width: "100%" }}>
//           {employeeData.length === 0 ? (
//             ""
//           ) : (
//             <Button
//               size="small"
//               onClick={handleSendButtonClick}
//               variant="contained"
//               style={{ float: "left" }}
//             >
//               Send
//             </Button>
//           )}
//           <div style={{ marginTop: 20 }}>
//             <Button
//               size="small"
//               onClick={() => {
//                 console.log("Saved Employees:", savedEmployees);
//                 console.log("Saved Manager IDs:", savedManagers);
//               }}
//               variant="contained"
//             >
//               Save Selected Employees
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;

// import {
//   Button,
//   Checkbox,
//   FormControl,
//   FormControlLabel,
//   InputLabel,
//   MenuItem,
//   Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
// } from "@mui/material";
// import axios from "axios";
// import React, { useContext, useEffect, useState } from "react";
// import { UseContext } from "../../../State/UseState/UseContext";
// import useGetUser from "../../../hooks/Token/useUser";
// import UserProfile from "../../../hooks/UserData/useUser";
// import useEmployeeStore from "./useEmployeeStore";

// const DataTable = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
//   const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
//   const [data1, setData1] = useState([]);
//   const [employeeData, setEmployeeData] = useState([]);
//   const [managerArray, setManagerArray] = useState([]);
//   const [initialEmployeeData, setInitialEmployeeData] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [documents, setDocuments] = useState([]);
//   // const [selectedDocumentId, setSelectedDocumentId] = useState("");
//   const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
//   const [selectedMDocId, setSelectedMDocId] = useState("");
//   const [managerIds, setManagerIds] = useState([]);
//   const [showManagerSelect, setShowManagerSelect] = useState(false); // State to track checkbox status
//   const { setAppAlert } = useContext(UseContext);
//   // const [selectAll, setSelectAll] = useState(false);
//   const { useGetCurrentRole } = UserProfile();
//   const role = useGetCurrentRole();
//   const authToken = useGetUser().authToken;
//   const { savedEmployees, savedManagers,addEmployee, removeEmployee, clearEmployees } =
//     useEmployeeStore();

//   useEffect(() => {
//     console.log(selectedEmployeeIds);
//     console.log(managerIds);
//     // eslint-disable-next-line
//   }, [selectedEmployeeIds]);

//  console.log("useEmployeeStore",useEmployeeStore());

//   const handleEmployeeSelection = async (event, id) => {
//     // Check if the current employee is already selected
//     const isCurrentlySelected = selectedEmployeeIds.indexOf(id) !== -1;

//     if (isCurrentlySelected) {
//       // Deselecting the employee
//       setSelectedEmployeeIds([]); // Clear the selection
//       setManagerIds([]); // Clear the manager IDs
//       removeEmployee(id); // Remove from Zustand store
//     } else {
//       // Select only one employee
//       setSelectedEmployeeIds([id]); // Set the new selection to this employee
//       try {
//         // Fetch manager ID for the selected employee
//         const managerIdResponse = await axios.get(
//           `${process.env.REACT_APP_API}/route/org/getManager/${id}`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );

//         // Now we define managerId from the response
//         const managerId = managerIdResponse.data.id;
//         console.log("Manager ID for selected employee:", managerId);

//         // Update manager IDs with the selected employee's manager
//         setManagerIds([managerId]);

//         // Handle employee selection in your Zustand store
//         const employee = employeeData.find((emp) => emp._id === id);
//         addEmployee(employee, [managerId]); // Pass the employee and manager ID to the store
//       } catch (error) {
//         console.error("Error fetching manager for employee", id, error);
//       }
//     }
//   };
//   const isSelected = (id) => selectedEmployeeIds.indexOf(id) !== -1;

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       let response;
//   //       if (role === "HR") {
//   //         response = await axios.get(
//   //           `${process.env.REACT_APP_API}/route/organization/getOneOrgHr`,
//   //           {
//   //             headers: { Authorization: authToken },
//   //           }
//   //         );

//   //         setData1(response.data.orgData);
//   //         setSelectedOrganizationId(response.data.orgData._id);
//   //         return response;
//   //       }
//   //       response = await axios.get(
//   //         `${process.env.REACT_APP_API}/route/organization/getall`,
//   //         {
//   //           headers: { Authorization: authToken },
//   //         }
//   //       );
//   //       setData1(response.data.orgData);
//   //     } catch (error) {
//   //       console.error("Error fetching organizations: ", error);
//   //     }
//   //   };

//   //   fetchData();
//   //   // eslint-disable-next-line
//   // }, [authToken]);

//   // console.log("this is the data1", data1);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let response;
//         if (role === "HR") {
//           response = await axios.get(
//             `${process.env.REACT_APP_API}/route/organization/getOneOrgHr`,
//             {
//               headers: { Authorization: authToken },
//             }
//           );

//           if (response.data.orgData) {
//             setData1([response.data.orgData]); // If HR organization exists, set it
//             setSelectedOrganizationId(response.data.orgData._id); // Automatically select the HR organization
//           } else {
//             // If no HR organization, fallback to fetching all organizations
//             response = await axios.get(
//               `${process.env.REACT_APP_API}/route/organization/getall`,
//               {
//                 headers: { Authorization: authToken },
//               }
//             );
//             setData1(response.data.orgData);
//             if (response.data.orgData.length > 0) {
//               setSelectedOrganizationId(response.data.orgData[0]._id); // Default to the first organization
//             }
//           }
//         } else {
//           // For other roles, get all organizations and set the first one by default
//           response = await axios.get(
//             `${process.env.REACT_APP_API}/route/organization/getall`,
//             {
//               headers: { Authorization: authToken },
//             }
//           );
//           setData1(response.data.orgData);
//           if (response.data.orgData.length > 0) {
//             setSelectedOrganizationId(response.data.orgData[0]._id); // Default to the first organization
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching organizations: ", error);
//       }
//     };

//     fetchData();
//     // eslint-disable-next-line
//   }, [authToken, role]); // Watch for authToken and role changes

//   useEffect(() => {
//     (async () => {
//       const resp = await axios.get(
//         `${process.env.REACT_APP_API}/route/org/getmanagers`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log("manager", resp.data.filteredManagers);
//       setManagerArray(resp.data.filteredManagers);
//     })();
//     // eslint-disable-next-line
//   }, []);

//   const fetchEmployees = async (orgId) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/employee/get/${orgId}`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       setEmployeeData(response.data.employees);
//       setInitialEmployeeData(response.data.employees);
//     } catch (error) {
//       console.error("Error fetching employees: ", error);
//     }
//   };

//   const fetchDepartments = async (orgId) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/department/getall/${orgId}`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       setDepartments(response.data.getOrgs);
//       console.log("Department List: ", response.data.getOrgs);
//     } catch (error) {
//       console.error("Error fetching departments: ", error);
//     }
//   };

//   useEffect(() => {
//     if (selectedOrganizationId) {
//       fetchEmployees(selectedOrganizationId);
//       fetchDepartments(selectedOrganizationId);
//     }

//     // eslint-disable-next-line
//   }, [selectedOrganizationId, authToken, data1]);

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/org/getdocs`,
//           {
//             headers: { Authorization: authToken },
//           }
//         );
//         setDocuments(response.data.doc);
//       } catch (error) {
//         console.error("Error fetching documents: ", error);
//       }
//     };

//     fetchDocuments();
//   }, [authToken]);

//   const handleSearchChange = (event) => {
//     const query = event.target.value.toLowerCase();
//     setSearchQuery(query);
//     const filteredEmployees = initialEmployeeData.filter((employee) => {
//       return (
//         employee.first_name.toLowerCase().includes(query) ||
//         employee.last_name.toLowerCase().includes(query)
//       );
//     });
//     setEmployeeData(filteredEmployees);
//   };

//   const handleOrganizationChange = (event) => {
//     const orgId = event.target.value;
//     setSelectedOrganizationId(orgId);
//     fetchDepartments(orgId);
//     setSelectedDepartmentId("");
//   };

//   const handleDepartmentChange = (event) => {
//     const deptId = event.target.value;
//     setSelectedDepartmentId(deptId);
//     const filteredEmployees = initialEmployeeData.filter((employee) => {
//       return employee?.deptname?.[0] === deptId;
//     });
//     setEmployeeData(filteredEmployees);
//   };

//   const handleDocumentChange2 = (event) => {
//     const mDocId = event.target.value;
//     setSelectedMDocId(mDocId);
//     console.log("Selected MDocument ID:", mDocId);
//     setEmployeeData(managerArray[mDocId].reporteeIds);
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <div className="flex gap-4">
//         <FormControl size="small" style={{ width: 200 }}>
//           <FormControlLabel
//             className="!text-xs"
//             control={
//               <Checkbox
//                 checked={showManagerSelect}
//                 onChange={() => setShowManagerSelect(!showManagerSelect)}
//                 color="primary"
//               />
//             }
//             label="Downcast"
//           />
//         </FormControl>

//         {data1.length > 0 && (
//           <FormControl size="small" style={{ width: 200 }}>
//             <InputLabel id="organization-label">Select Organization</InputLabel>
//             <Select
//               label="Select organization"
//               name="type"
//               onChange={handleOrganizationChange}
//             >
//               {data1.map((org) => (
//                 <MenuItem key={org._id} value={org._id}>
//                   {org.orgName}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}
//         <FormControl size="small" style={{ width: 200 }}>
//           <InputLabel id="department-label">Select Department</InputLabel>
//           <Select
//             label="Select department"
//             name="type"
//             onChange={handleDepartmentChange}
//             value={selectedDepartmentId}
//           >
//             {departments.length === 0 ? (
//               <MenuItem value="">No Departments Found</MenuItem>
//             ) : (
//               departments?.map((dept) => (
//                 <MenuItem key={dept._id} value={dept._id}>
//                   {dept?.departmentName}
//                 </MenuItem>
//               ))
//             )}
//           </Select>
//         </FormControl>

//         <TextField
//           label="Search Employee"
//           variant="outlined"
//           size="small"
//           value={searchQuery}
//           onChange={handleSearchChange}
//         />

//         {showManagerSelect && (
//           <FormControl size="small" style={{ width: 200 }}>
//             <InputLabel id="document-label">Select Manager</InputLabel>
//             <Select
//               label="Select Manager"
//               name="document"
//               onChange={handleDocumentChange2}
//               value={selectedMDocId}
//             >
//               {managerArray?.map((doc, idx) => (
//                 <MenuItem key={doc._id} value={idx}>
//                   {doc.managerId?.first_name &&
//                     doc.managerId?.last_name &&
//                     doc.managerId?.first_name + " " + doc.managerId?.last_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}
//       </div>
//       <div style={{ width: "100%", overflowY: "auto", maxHeight: "450px" }}>
//         {employeeData.length === 0 ? (
//           <p className="text-center font-semibold">no employee available</p>
//         ) : (
//           <TableContainer className=" pt-3">
//             <Table className="min-w-full bg-white text-left !text-sm font-light ">
//               <TableHead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//                 <TableRow className="!font-semibold">
//                   <TableCell padding="checkbox">
//                   </TableCell>
//                   <TableCell className="!font-semibold">Sr.No</TableCell>
//                   <TableCell className="!font-semibold">First Name</TableCell>
//                   <TableCell className="!font-semibold">Last Name</TableCell>
//                   <TableCell className="!font-semibold">Employee Id</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//   {employeeData?.map((employee, idx) => {
//     const isItemSelected = isSelected(employee._id);
//     return (
//       <TableRow
//         key={employee._id}
//         hover
//         onClick={(event) => handleEmployeeSelection(event, employee._id)}
//         role="checkbox"
//         aria-checked={isItemSelected}
//         selected={isItemSelected}
//       >
//         <TableCell padding="checkbox">
//           <Checkbox
//             checked={isItemSelected}
//             disabled={selectedEmployeeIds.length > 0 && !isItemSelected} // Disable other checkboxes when one is selected
//           />
//         </TableCell>
//         <TableCell>{idx + 1}</TableCell>
//         <TableCell>{employee.first_name}</TableCell>
//         <TableCell>{employee.last_name}</TableCell>
//         <TableCell>{employee.empId}</TableCell>
//       </TableRow>
//     );
//   })}
// </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//         <div style={{ position: "absolute", bottom: -30, width: "100%" }}>

//           <div style={{ marginTop: 20 }}>
//             <Button
//               size="small"
//               onClick={() => {
//                 setAppAlert({
//                   alert: true,
//                   type: "success",
//                   msg: "Employee Saved For Sending Letters",
//                 });

//                 console.log("Saved Employees:", savedEmployees);
//                 console.log("Saved Manager IDs:", savedManagers);
//               }}
//               variant="contained"
//             >
//               Save Selected Employees
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;

import {
  Box,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UseContext } from "../../../State/UseState/UseContext";
import useGetUser from "../../../hooks/Token/useUser";
import UserProfile from "../../../hooks/UserData/useUser";
import useEmployeeStore from "./useEmployeeStore";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const DataTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [data1, setData1] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [managerArray, setManagerArray] = useState([]);
  const [initialEmployeeData, setInitialEmployeeData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [documents, setDocuments] = useState([]);
  // const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [selectedMDocId, setSelectedMDocId] = useState("");
  const [managerIds, setManagerIds] = useState([]);
  const [showManagerSelect, setShowManagerSelect] = useState(false); // State to track checkbox status
  const { setAppAlert } = useContext(UseContext);
  // const [selectAll, setSelectAll] = useState(false);
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const authToken = useGetUser().authToken;
  const {
    savedEmployees,
    savedManagers,
    addEmployee,
    removeEmployee,
    // clearEmployees,
  } = useEmployeeStore();

  useEffect(() => {
    console.log(selectedEmployeeIds);
    console.log(managerIds);
    // eslint-disable-next-line
  }, [selectedEmployeeIds]);

  console.log("useEmployeeStore", useEmployeeStore());

  const handleEmployeeSelection = async (event, id) => {
    // Check if the current employee is already selected
    const isCurrentlySelected = selectedEmployeeIds.indexOf(id) !== -1;

    if (isCurrentlySelected) {
      // Deselecting the employee
      setSelectedEmployeeIds([]); // Clear the selection
      setManagerIds([]); // Clear the manager IDs
      removeEmployee(id); // Remove from Zustand store
    } else {
      // Select only one employee
      setSelectedEmployeeIds([id]); // Set the new selection to this employee
      try {
        // Fetch manager ID for the selected employee
        const managerIdResponse = await axios.get(
          `${process.env.REACT_APP_API}/route/org/getManager/${id}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        // Now we define managerId from the response
        const managerId = managerIdResponse.data.id;
        console.log("Manager ID for selected employee:", managerId);

        // Update manager IDs with the selected employee's manager
        setManagerIds([managerId]);

        // Handle employee selection in your Zustand store
        const employee = employeeData.find((emp) => emp._id === id);
        addEmployee(employee, [managerId]); // Pass the employee and manager ID to the store
      } catch (error) {
        console.error("Error fetching manager for employee", id, error);
      }
    }
  };
  const isSelected = (id) => selectedEmployeeIds.indexOf(id) !== -1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (role === "HR") {
          response = await axios.get(
            `${process.env.REACT_APP_API}/route/organization/getOneOrgHr`,
            {
              headers: { Authorization: authToken },
            }
          );
          setData1(response.data.orgData);
          setSelectedOrganizationId(response.data.orgData._id);
          return response;
        }
        response = await axios.get(
          `${process.env.REACT_APP_API}/route/organization/getall`,
          {
            headers: { Authorization: authToken },
          }
        );
        setData1(response.data.orgData);
      } catch (error) {
        console.error("Error fetching organizations: ", error);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [authToken]);

  // console.log("this is the data1", data1);

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/org/getmanagers`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log("manager", resp.data.filteredManagers);
      setManagerArray(resp.data.filteredManagers);
    })();
    // eslint-disable-next-line
  }, []);

  const fetchEmployees = async (orgId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get/${orgId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      setEmployeeData(response.data.employees);
      setInitialEmployeeData(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees: ", error);
    }
  };

  const fetchDepartments = async (orgId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/getall/${orgId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      setDepartments(response.data.getOrgs);
      console.log("Department List: ", response.data.getOrgs);
    } catch (error) {
      console.error("Error fetching departments: ", error);
    }
  };

  useEffect(() => {
    if (selectedOrganizationId) {
      fetchEmployees(selectedOrganizationId);
      fetchDepartments(selectedOrganizationId);
    }

    // eslint-disable-next-line
  }, [selectedOrganizationId, authToken, data1]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/org/getdocs`,
          {
            headers: { Authorization: authToken },
          }
        );
        setDocuments(response.data.doc);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchDocuments();
  }, [authToken]);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredEmployees = initialEmployeeData.filter((employee) => {
      return (
        employee.first_name.toLowerCase().includes(query) ||
        employee.last_name.toLowerCase().includes(query)
      );
    });
    setEmployeeData(filteredEmployees);
  };

  const handleOrganizationChange = (event) => {
    const orgId = event.target.value;
    setSelectedOrganizationId(orgId);
    fetchDepartments(orgId);
    setSelectedDepartmentId("");
  };

  const handleDepartmentChange = (event) => {
    const deptId = event.target.value;
    setSelectedDepartmentId(deptId);
    const filteredEmployees = initialEmployeeData.filter((employee) => {
      return employee?.deptname?.[0] === deptId;
    });
    setEmployeeData(filteredEmployees);
  };

  const handleDocumentChange2 = (event) => {
    const mDocId = event.target.value;
    setSelectedMDocId(mDocId);
    console.log("Selected MDocument ID:", mDocId);
    setEmployeeData(managerArray[mDocId].reporteeIds);
  };

  return (
    // <BoxComponent>
    // <HeadingOneLineInfo heading={" Select Employee From List"} />
    <div style={{ padding: "30px", backgroundColor: "#f4f6f9" }}>
      {/* Heading Section */}
      <Box mb={3}>
        <Typography
          variant="h5"
          color="primary"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          Select Employee From List
        </Typography>
      </Box>

      {/* Filter Section */}
      <Box mb={3}>
        <Card sx={{ padding: "20px", boxShadow: 3 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Downcast Checkbox */}
            <Grid item>
              <FormControl size="small" style={{ width: 220 }}>
                <FormControlLabel
                  className="!text-xs"
                  control={
                    <Checkbox
                      checked={showManagerSelect}
                      onChange={() => setShowManagerSelect(!showManagerSelect)}
                      color="primary"
                    />
                  }
                  label="Downcast"
                />
              </FormControl>
            </Grid>

            {/* Select Organization */}
            {data1.length > 0 && (
              <Grid item>
                <FormControl size="small" style={{ width: 220 }}>
                  <InputLabel id="organization-label">
                    Select Organization
                  </InputLabel>
                  <Select
                    label="Select organization"
                    name="type"
                    onChange={handleOrganizationChange}
                  >
                    {data1.map((org) => (
                      <MenuItem key={org._id} value={org._id}>
                        {org.orgName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Select Department */}
            <Grid item>
              <FormControl size="small" style={{ width: 220 }}>
                <InputLabel id="department-label">Select Department</InputLabel>
                <Select
                  label="Select department"
                  name="type"
                  onChange={handleDepartmentChange}
                  value={selectedDepartmentId}
                >
                  {departments.length === 0 ? (
                    <MenuItem value="">No Departments Found</MenuItem>
                  ) : (
                    departments?.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept?.departmentName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Search Employee */}
            <Grid item>
              <TextField
                label="Search Employee"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ width: 220 }}
              />
            </Grid>

            {/* Select Manager (only if showManagerSelect is true) */}
            {showManagerSelect && (
              <Grid item>
                <FormControl size="small" style={{ width: 220 }}>
                  <InputLabel id="document-label">Select Manager</InputLabel>
                  <Select
                    label="Select Manager"
                    name="document"
                    onChange={handleDocumentChange2}
                    value={selectedMDocId}
                  >
                    {managerArray?.map((doc, idx) => (
                      <MenuItem key={doc._id} value={idx}>
                        {doc.managerId?.first_name &&
                          doc.managerId?.last_name &&
                          `${doc.managerId?.first_name} ${doc.managerId?.last_name}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </Card>
      </Box>

      {/* Table Section */}
      <Box sx={{ width: "100%", overflowY: "auto", maxHeight: "450px" }}>
        {employeeData.length === 0 ? (
          <p className="text-center font-semibold">No employees available</p>
        ) : (
          <Card sx={{ boxShadow: 3, padding: "20px" }}>
            <TableContainer>
              <Table className="min-w-full bg-white text-left !text-sm font-light">
                <TableHead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell className="!font-semibold">Sr.No</TableCell>
                    <TableCell className="!font-semibold">First Name</TableCell>
                    <TableCell className="!font-semibold">Last Name</TableCell>
                    <TableCell className="!font-semibold">
                      Employee Id
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeData?.map((employee, idx) => {
                    const isItemSelected = isSelected(employee._id);
                    return (
                      <TableRow
                        key={employee._id}
                        hover
                        onClick={(event) =>
                          handleEmployeeSelection(event, employee._id)
                        }
                        role="checkbox"
                        aria-checked={isItemSelected}
                        selected={isItemSelected}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "#e3f2fd",
                          },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            disabled={
                              selectedEmployeeIds.length > 0 && !isItemSelected
                            }
                          />
                        </TableCell>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{employee.first_name}</TableCell>
                        <TableCell>{employee.last_name}</TableCell>
                        <TableCell>{employee.empId}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </Box>


{employeeData.length > 0 && (
  <div className="flex justify-center pt-5">
    <button
      className="px-6 py-3 rounded-lg shadow-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
      onClick={() => {
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Employee Saved For Sending Letters",
        });
        console.log("Saved Employees:", savedEmployees);
        console.log("Saved Manager IDs:", savedManagers);
      }}
    >
      Save Selected Employees
    </button>
  </div>
)}


    </div>
    // </BoxComponent>
  );
};

export default DataTable;
