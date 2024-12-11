// import { Button, IconButton } from "@mui/material";
// import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
// import axios from "axios";
// import React, { useContext, useState } from "react";
// import { UseContext } from "../../State/UseState/UseContext";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import UserProfile from "../../hooks/UserData/useUser";
// import { Add, Info } from "@mui/icons-material";
// import UploadDocumentModal from "./components/UploadDocumentModal";
// import ViewDocumentSkeleton from "./components/ViewDocumentSkeleton";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import { TestContext } from "../../State/Function/Main";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from "@mui/material";

// const DocManage = () => {
//   // to define the state, token , and import other function
//   const { handleAlert } = useContext(TestContext);
//   const queryClient = useQueryClient();
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const employeeId = user && user._id;
//   const organizationId = user && user.organizationId;
//   const { cookies } = useContext(UseContext);
//   const token = cookies["aegis"];

//   //to get the data of employee who have uploaded document
//   const { data: getRecordOfEmployee, isLoading } = useQuery(
//     ["getRecordOfEmp"],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organizationId}`,
//         {
//           headers: {
//             Authorization: token,
//           },
//         }
//       );
//       return response.data.data;
//     }
//   );
//   console.log("getRecordOfEmployee", getRecordOfEmployee);

//   // for upload the document
//   const [createModalOpen, setCreateModalOpen] = useState(false);
//   const handleCreateModalOpen = () => {
//     setCreateModalOpen(true);
//   };
//   const handleCreateModalClose = () => {
//     setCreateModalOpen(false);
//   };

//   // for delete
//   const [deleteConfirmation, setDeleteConfirmation] = useState(null);

//   const handleDeleteConfirmation = (id) => {
//     setDeleteConfirmation(id);
//   };

//   const handleCloseConfirmation = () => {
//     setDeleteConfirmation(null);
//   };

//   const handleDelete = (id) => {
//     deleteMutation.mutate(id);
//     handleCloseConfirmation();
//   };

//   const deleteMutation = useMutation(
//     (id) =>
//       axios.delete(
//         `${process.env.REACT_APP_API}/route/delete-update-document/${id}`,
//         {
//           headers: {
//             Authorization: token,
//           },
//         }
//       ),
//     {
//       onSuccess: () => {
//         // Invalidate and refetch the data after successful deletion
//         queryClient.invalidateQueries("getRecordOfEmp");
//         handleAlert(true, "success", "Document deleted successfully");
//       },
//     }
//   );

//   // for edit
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedFileForEdit, setSelectedFileForEdit] = useState(null); // Store the file ID
//   const [selectedFile, setSelectedFile] = useState(null); // Store the file object

//   // Handle opening and closing the edit modal
//   const handleEditModalOpen = (file) => {
//     setSelectedFileForEdit(file); // Set the file to be edited
//     setEditModalOpen(true);
//   };
//   console.log("selectedFileForEdit", selectedFileForEdit);

//   const handleEditModalClose = () => {
//     setEditModalOpen(false);
//     setSelectedFileForEdit(null);
//   };

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]); // Set the selected file
//   };

//   console.log("selectedFile", selectedFile);

//   // Function to handle file upload
//   const handleFileUpdate = () => {
//     console.log(selectedFile)
//     if (selectedFile && selectedFileForEdit?._id) {
//       editMutation.mutate({
//         fileId: selectedFileForEdit._id,
//         file: selectedFile,
//       });
//     }
//     handleEditModalClose();
//   };

//   const editMutation = useMutation(
//     async ({ fileId, file }) => {
//       const formData = new FormData();
//       formData.append("file", file);

//       return axios.put(
//         `${process.env.REACT_APP_API}/route/update-document/${fileId}`,
//         formData,
//         {
//           headers: {
//             Authorization: token,
//             "Content-Type": "multipart/form-data", // Set the content type
//           },
//         }
//       );
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("getRecordOfEmp");
//         handleCreateModalClose()
//         handleAlert(true, "success", "Document updated successfully");
       
//       },
//     }
//   );

//   return (
//     <>
//       <section className="bg-gray-50 min-h-screen w-full">
//         <article className="bg-white w-full h-max shadow-md rounded-sm border items-center flex flex-col">
//           <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
//             <div className="flex gap-3">
//               <div className="mt-1">
//                 <EventNoteOutlinedIcon />
//               </div>
//               <div>
//                 <h1 className="!text-lg">Document Manage</h1>
//                 <p className="text-xs text-gray-600">
//                   Manage the document here.
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
//             {getRecordOfEmployee?.length > 0 && (
//               <div className="flex gap-2 w-full">
//                 <h1 className="text-lg">Your uploaded document</h1>
//               </div>
//             )}
//             <div className="flex justify-end w-full">
//               <Button
//                 className="!font-semibold !bg-sky-500 flex gap-2"
//                 variant="contained"
//                 onClick={handleCreateModalOpen}
//               >
//                 <Add />
//                 Upload Document
//               </Button>
//             </div>
//           </div>

//           {isLoading ? (
//             <ViewDocumentSkeleton />
//           ) : getRecordOfEmployee?.files?.length > 0 ? (
//             <>
//               <div className="flex w-full">
//                 <div className="overflow-auto p-0 border border-gray-200 w-full">
//                   <table className="min-w-full bg-white text-left text-sm font-light table-auto">
//                     <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//                       <tr className="font-semibold">
//                         <th scope="col" className="text-left pl-6 py-3">
//                           SR NO
//                         </th>
//                         <th scope="col" className="px-6 py-3">
//                           File Name
//                         </th>
//                         <th scope="col" className="px-8 py-3">
//                           Document Type
//                         </th>
//                         <th scope="col" className="px-6 py-3">
//                           Edit
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {getRecordOfEmployee &&
//                         getRecordOfEmployee?.files?.map((data, id) => {
//                           return (
//                             <tr className="font-medium border-b" key={id}>
//                               <td className="text-left pl-6 py-3">{id + 1}</td>
//                               <td className="py-3 pl-6">{data.fileName}</td>
//                               <td className="py-3 pl-6">
//                                 {data.selectedValue}
//                               </td>
//                               <td className="whitespace-nowrap px-6 py-2">
//                                 <IconButton
//                                   color="primary"
//                                   aria-label="edit"
//                                   onClick={() => handleEditModalOpen(data)} // Open edit modal with the selected file
//                                 >
//                                   <EditOutlinedIcon />
//                                 </IconButton>

//                                 <IconButton
//                                   color="error"
//                                   aria-label="delete"
//                                   onClick={() =>
//                                     handleDeleteConfirmation(data?._id)
//                                   }
//                                 >
//                                   <DeleteOutlineIcon />
//                                 </IconButton>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
//               <article className="flex items-center mb-1 text-red-500 gap-2">
//                 <Info className="!text-2xl" />
//                 <h1 className="text-lg font-semibold">Upload Document</h1>
//               </article>
//               <p>No document found. Upload the document.</p>
//             </section>
//           )}
//         </article>
//       </section>

//       {/* for create */}
//       <UploadDocumentModal
//         handleClose={handleCreateModalClose}
//         open={createModalOpen}
//       />

//       {/* for delete */}
//       <Dialog
//         open={deleteConfirmation !== null}
//         onClose={handleCloseConfirmation}
//       >
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent>
//           <p>
//             Please confirm your decision to delete this document, as this action
//             cannot be undone.
//           </p>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={handleCloseConfirmation}
//             variant="outlined"
//             color="primary"
//             size="small"
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             size="small"
//             onClick={() => handleDelete(deleteConfirmation)}
//             color="error"
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={editModalOpen} onClose={handleEditModalClose}>
//         <DialogTitle>Edit Document</DialogTitle>
//         <DialogContent>
//           <input type="file" onChange={handleFileChange} />
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={handleEditModalClose}
//             variant="outlined"
//             color="primary"
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleFileUpdate}
//             color="primary"
//           >
//             Update
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default DocManage;


import React, { useContext, useState } from "react";
import { 
  Button, 
  IconButton, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle 
} from "@mui/material";
import { Add, Info } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../../hooks/UserData/useUser";
import UploadDocumentModal from "./components/UploadDocumentModal";
import ViewDocumentSkeleton from "./components/ViewDocumentSkeleton";

// Component
const DocManage = () => {
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user && user._id;
  const organizationId = user && user.organizationId;
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];

  // State for modals and file handling
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFileForEdit, setSelectedFileForEdit] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Fetching documents
  const { data: getRecordOfEmployee, isLoading } = useQuery(
    ["getRecordOfEmp"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organizationId}`,
        {
          headers: { Authorization: token },
        }
      );
      return response.data.data;
    }
  );

  // Function to upload to S3
  const uploadToS3 = async (file, folder = "EmployeeDocument") => {
    const { data: { url } } = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/${folder}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    await axios.put(url, file, {
      headers: { "Content-Type": file.type },
    });

    return url.split("?")[0]; // Return the uploaded file URL
  };

  // Handle Create Modal Open/Close
  const handleCreateModalOpen = () => setCreateModalOpen(true);
  const handleCreateModalClose = () => setCreateModalOpen(false);

  // Handle Edit Modal Open/Close
  const handleEditModalOpen = (file) => {
    setSelectedFileForEdit(file);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedFileForEdit(null);
    setSelectedFile(null);
  };

  // Handle file selection for editing
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Update file in S3 and backend
  const handleFileUpdate = async () => {
    if (selectedFile && selectedFileForEdit?._id) {
      const newUrl = await uploadToS3(selectedFile); // Upload new file
      editMutation.mutate({ fileId: selectedFileForEdit._id, url: newUrl });
    }
    handleEditModalClose();
  };

  const editMutation = useMutation(
    async ({ fileId, url }) => {
      return axios.put(
        `${process.env.REACT_APP_API}/route/update-document/${fileId}`,
        { url: url },
        {
          headers: { Authorization: token },
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getRecordOfEmp");
        handleAlert(true, "success", "Document updated successfully");
      },
    }
  );

  // Delete Document
  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/delete-update-document/${id}`,
        {
          headers: { Authorization: token },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getRecordOfEmp");
        handleAlert(true, "success", "Document deleted successfully");
      },
    }
  );

  const handleDeleteConfirmation = (id) => setDeleteConfirmation(id);
  const handleCloseConfirmation = () => setDeleteConfirmation(null);
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <article className="bg-white w-full h-max shadow-md rounded-sm border items-center flex flex-col">
          <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
            <div className="flex gap-3">
              <div className="mt-1">
                <EventNoteOutlinedIcon />
              </div>
              <div>
                <h1 className="!text-lg">Document Manage</h1>
                <p className="text-xs text-gray-600">
                  Manage the document here.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
            {getRecordOfEmployee?.length > 0 && (
              <div className="flex gap-2 w-full">
                <h1 className="text-lg">Your uploaded document</h1>
              </div>
            )}
            <div className="flex justify-end w-full">
              <Button
                className="!font-semibold !bg-sky-500 flex gap-2"
                variant="contained"
                onClick={handleCreateModalOpen}
              >
                <Add />
                Upload Document
              </Button>
            </div>
          </div>

          {isLoading ? (
            <ViewDocumentSkeleton />
          ) : getRecordOfEmployee?.files?.length > 0 ? (
            <>
              <div className="flex w-full">
                <div className="overflow-auto p-0 border border-gray-200 w-full">
                  <table className="min-w-full bg-white text-left text-sm font-light table-auto">
                    <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                      <tr className="font-semibold">
                        <th scope="col" className="text-left pl-6 py-3">
                          SR NO
                        </th>
                        <th scope="col" className="px-6 py-3">
                          File Name
                        </th>
                        <th scope="col" className="px-8 py-3">
                          Document Type
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Edit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getRecordOfEmployee &&
                        getRecordOfEmployee?.files?.map((data, id) => {
                          return (
                            <tr className="font-medium border-b" key={id}>
                              <td className="text-left pl-6 py-3">{id + 1}</td>
                              <td className="py-3 pl-6">{data.fileName}</td>
                              <td className="py-3 pl-6">
                                {data.selectedValue}
                              </td>
                              <td className="whitespace-nowrap px-6 py-2">
                                <IconButton
                                  color="primary"
                                  aria-label="edit"
                                  onClick={() => handleEditModalOpen(data)}
                                >
                                  <EditOutlinedIcon />
                                </IconButton>

                                <IconButton
                                  color="error"
                                  aria-label="delete"
                                  onClick={() =>
                                    handleDeleteConfirmation(data?._id)
                                  }
                                >
                                  <DeleteOutlineIcon />
                                </IconButton>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">Upload Document</h1>
              </article>
              <p>No document found. Upload the document.</p>
            </section>
          )}
        </article>
      </section>

      {/* for create */}
      <UploadDocumentModal
        handleClose={handleCreateModalClose}
        open={createModalOpen}
      />

      {/* for delete */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this document, as this action
            cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(deleteConfirmation)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editModalOpen} onClose={handleEditModalClose}>
        <DialogTitle>Edit Document</DialogTitle>
        <DialogContent>
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEditModalClose}
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleFileUpdate}
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocManage;
