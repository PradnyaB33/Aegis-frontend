import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";


import UserProfile from "../../../hooks/UserData/useUser";
import CloseIcon from "@mui/icons-material/Close";
import DocPreviewModal from "../../DocumentManagement/components/Modal";
import useVendorState from "../../../hooks/Vendor-Onboarding/useVendorState";



const MAX_TOTAL_FILE_SIZE = 5120 * 1024;

const Uploaddocument = ({ handleClose, open }) => {
  // to define the state, token , and import other function
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  console.log("user", user);
  const employeeId = user && user._id;
  const organizationId = user && user.organizationId;
  console.log({ employeeId, organizationId });

  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const { setAppAlert } = useContext(UseContext);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [totalFileSize, setTotalFileSize] = useState(0);
  const [documentFields, setDocumentFields] = useState([
    {
      selectedValue: "",
      uploadedFile: null,
      fileName: "no file selected",
      customDocumentName: "",
      loading: false,
    },
  ]);

   const {setDocument } = useVendorState();
   const {  setCreateModalOpen } = useVendorState();

  useEffect(() => {}, [documentFields]);

  // to define the function for change the select field
  const handleSelect = (index, value) => {
    const updatedDocumentFields = [...documentFields];
    updatedDocumentFields[index].selectedValue = value;

    if (value === "Custom") {
      updatedDocumentFields[index].selectedValue = "";
      updatedDocumentFields[index].isCustom = true;
    } else {
      updatedDocumentFields[index].isCustom = false;
    }
    setDocumentFields(updatedDocumentFields);
  };

  // to define the function for add the custome field
  const handleCustomNameChange = (index, value) => {
    const updatedDocumentFields = [...documentFields];
    updatedDocumentFields[index].customDocumentName = value;
    setDocumentFields(updatedDocumentFields);
  };

  // to upload file
  const handleFileUpload = (index, event) => {
    const allowedFileTypes = ["application/pdf", "image/jpeg", "image/png"];
    const files = event.target.files;
    const file = files[0];
    if (!allowedFileTypes.includes(file.type)) {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Only PDFs and images are allowed for upload.",
      });
      event.target.value = null;
      return;
    }

    const tempDocumentFields = [...documentFields];
    tempDocumentFields[index].uploadedFile = file;
    const tempTotalFileSize = tempDocumentFields.reduce(
      (totalSize, field) =>
        totalSize + (field.uploadedFile ? field.uploadedFile.size : 0),
      0
    );

    if (tempTotalFileSize > MAX_TOTAL_FILE_SIZE) {
      setAppAlert({
        alert: true,
        type: "error",
        msg: `File "${file.name}" exceeds the size limit of 5 MB`,
      });
      event.target.value = null;
      tempDocumentFields[index].uploadedFile = null;
      tempDocumentFields[index].fileName = "No file selected";
      setDocumentFields(tempDocumentFields);
      return;
    }

    const updatedDocumentFields = [...documentFields];
    updatedDocumentFields[index].uploadedFile = file;
    updatedDocumentFields[index].fileName = file
      ? file.name
      : "No file selected";
    setDocumentFields(updatedDocumentFields);
  };

  // to find out file size
  useEffect(() => {
    let totalSize = 0;
    documentFields.forEach((field) => {
      if (field.uploadedFile) {
        totalSize += field.uploadedFile.size;
      }
    });
    setTotalFileSize(totalSize);
  }, [documentFields]);




//get select option data from array

  const { data: getRecordOfEmployee, isLoading, error } = useQuery(
    ["getRecordOfEmployee", organizationId], // Adding organizationId to the query key
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/selecteddoc/${organizationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.data; // Adjust based on your API response structure
    }
  );

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  // Extract selectedDocuments with optional chaining
  const options = getRecordOfEmployee?.selectedDocuments || [];

  console.log("getRecordOfEmployee", options);


  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
  };
  

  // to submit the data in databased
  const handleSubmit = async () => {
      try {
      console.log("totalFileSize", totalFileSize);
      console.log("maxTotalFileSize", MAX_TOTAL_FILE_SIZE);

      if (totalFileSize > MAX_TOTAL_FILE_SIZE) {
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Total file size exceeds the limit of 500 KB",
        });
        return;
      }

      console.log("documentFields", documentFields);

      // Prepare the formData object for submission
      const formData = {
        documents: [],
      };

      // Iterate over each document field
      for (let i = 0; i < documentFields.length; i++) {
        const {
          selectedValue,
          fileName,
          uploadedFile,
          isCustom,
          customDocumentName,
        } = documentFields[i];

        // Validation: Ensure document is selected and custom document has a name
        if (
          (!selectedValue && !isCustom) ||
          (isCustom && !customDocumentName)
        ) {
          setAppAlert({
            alert: true,
            type: "error",
            msg: "Please select a document and provide a  custom name for all fields.",
          });
          return;
        }

        // Push valid document field data into submissionData.documents array
        formData.documents.push({
          selectedValue,
          fileName,
          uploadedFile, // File object that will be handled by the backend
          isCustom,
          customDocumentName,
        });
      }

 
      console.log("formdocumentData", formData);

       setDocument(formData)
      
       

        setAppAlert({
          alert: true,
          type: "success",
          msg: "Documents uploaded successfully!",
        });

        handleCreateModalClose()
      
    } catch (error) {
      console.error("Error uploading files:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "An error occurred while uploading files.",
      });
    }
  };

  // to define the function for add more field

  const handleAddMore = () => {
    setDocumentFields((prevState) => [
      ...prevState,
      {
        selectedValue: "",
        uploadedFile: null,
        fileName: "No file selected",
        customDocumentName: "",
        loading: false,
      },
    ]);
  };

  // to define the function for remove the added row
  const handleDiscardRow = (index) => {
    setDocumentFields((prevState) => prevState.filter((_, i) => i !== index));
  };

  // to findOut remaining file size
  const remainingFileSizeKB = (MAX_TOTAL_FILE_SIZE - totalFileSize) / 1024;

  // to define the funciton for open the modal
  const openModal = (index) => {
    setPreviewIndex(index);
    setUploadedFiles((prevFiles) => [
      ...prevFiles.slice(0, index),
      documentFields[index].uploadedFile,
      ...prevFiles.slice(index + 1),
    ]);
    setShowModal(true);
  };
  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "800px!important",
          height: "100%",
          maxHeight: "90vh!important",
        },
      }}
      open={open}
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <div>
          <div>
            <div className="md:w-[800px] w-[350px] m-auto mt-6 md:pl-6 pl-3 md:pr-6 pr-3 pt-3 pb-3 rounded-lg">
              <div
                style={{ borderBottom: "2px solid #b8b8b8" }}
                className="text-center mb-5 pb-3 w-full"
              >
                {/* Add a close button at the top-right corner */}
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: "red", // Color for the cross icon
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <h1 className="text-center md:text-3xl text-2xl">
                  Upload Document 
                </h1>
                <p>Here you can upload your documents</p>
              </div>
              {documentFields &&
                documentFields?.map((field, index) => (
                  <div
                    key={index}
                    style={{
                      boxShadow:
                        "0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)",
                    }}
                    className="w-full h-auto md:h-[8vh] md:flex md:items-center md:justify-between pl-3 pt-3 md:pt-0 pr-3 mb-4 rounded-lg"
                  >
                    {field.isCustom ? (
                      <TextField
                        label="Custom Document Name"
                        size="small"
                        sx={{ width: "23%" }}
                        variant="outlined"
                        value={field.customDocumentName}
                        onChange={(e) =>
                          handleCustomNameChange(index, e.target.value)
                        }
                      />
                    ) : (
                      <FormControl className="md:w-[170px] w-full" size="small">
                        <InputLabel id={`select-doc-label-${index}`}>
                          Select Document
                        </InputLabel>
                        <Select
                          labelId={`select-doc-label-${index}`}
                          label="Select Document"
                          value={field.selectedValue}
                          size="small"
                          onChange={(e) => handleSelect(index, e.target.value)}
                        >
                          {options.map(
                            (option, optionIndex) =>
                              // Prevent selecting the same document again
                              !documentFields
                                .slice(0, index)
                                .map((field) => field.selectedValue)
                                .includes(option) && (
                                <MenuItem key={optionIndex} value={option}>
                                  {option}
                                </MenuItem>
                              )
                          )}
                        </Select>
                      </FormControl>
                    )}
                    <div
                      className="md:justify-normal justify-between md:mt-0 mt-3 pb-3 md:pb-0"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <>
                        <input
                          id={`file-upload-${index}`}
                          type="file"
                          style={{ display: "none" }}
                          disabled={!field.selectedValue && !field.isCustom}
                          onChange={(e) => handleFileUpload(index, e)}
                        />
                        <div className="w-8 h-8 flex justify-center items-center rounded-full mr-2">
                          {field.loading ? (
                            <CircularProgress size={24} />
                          ) : (
                            field.uploadedFile && (
                              <CheckIcon
                                style={{
                                  color: "#FFF",
                                  backgroundColor: "#25E52E",
                                  borderRadius: "50%",
                                }}
                              />
                            )
                          )}
                        </div>

                        <label htmlFor={`file-upload-${index}`}>
                          <div className="md:w-28">
                            <Button
                              size="small"
                              variant="contained"
                              component="span"
                              disabled={!field.selectedValue && !field.isCustom}
                            >
                              Upload
                            </Button>
                          </div>
                        </label>
                        <span className="md:w-28 mr-3 ml-3 text-xs">
                          {field.fileName}
                        </span>
                        <Button
                          size="small"
                          color="info"
                          disabled={!field.uploadedFile}
                          variant="contained"
                          onClick={() => openModal(index)}
                        >
                          Show Doc
                        </Button>
                      </>
                      {documentFields.length > 1 && (
                        <div
                          className="h-6 w-6 flex justify-center items-center rounded-full ml-2 cursor-pointer"
                          onClick={() => handleDiscardRow(index)}
                        >
                          <IconButton color="error" aria-label="delete">
                            <DeleteOutlineIcon />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              <div className="w-full flex justify-center mt-6 gap-4 mb-2">
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={handleAddMore}
                >
                  Add More
                </Button>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>

              <div className="flex justify-center gap-2">
                <span className="text-xs">Maximum Size Allowed :</span>
                <span className="text-xs text-red-600">
                  {remainingFileSizeKB >= 0
                    ? ` ${remainingFileSizeKB.toFixed(2)} KB`
                    : "Size limit exceeded"}
                </span>
              </div>
            </div>

            <DocPreviewModal
              fileData={uploadedFiles[previewIndex]}
              openState={showModal}
              setOpenState={setShowModal}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Uploaddocument;
