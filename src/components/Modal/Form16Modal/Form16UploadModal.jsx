import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Modal,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const Form16UploadModal = ({
  handleClose,
  open,
  organizationId,
  employeeId,
}) => {
  console.log(employeeId);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  // state
  const [year, setYear] = useState("current");
  const [file, setFile] = useState(null);
  console.log("fssile", file);

  const [errorMessage, setErrorMessage] = useState("");
  // user is able to change the  year from current to previous
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 150 * 1024;

    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setErrorMessage("File size exceeds the limit of 150kb.");
    } else {
      setFile(selectedFile);
      setErrorMessage("");
    }
  };
  const handleUpload = async () => {
    try {
      // Check if file is already uploaded for the given organization and employee
      const response = await fetch(
        `${process.env.REACT_APP_API}/route/check/form16`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
          body: JSON.stringify({
            organizationId,
            employeeId,
            year,
          }),
        }
      );
      const data = await response.json();

      if (data.exists) {
        // File already exists, prompt user to confirm before proceeding
        const confirmed = window.confirm(
          "Form 16 file is already uploaded. Do you want to upload it again?"
        );
        if (!confirmed) {
          handleClose();
          return;
        }
      }
    } catch (error) {
      console.error("Error checking Form 16 file:", error);
      handleAlert(error);
      return;
    }

    if (!file) {
      setErrorMessage("Please select the file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("organizationId", organizationId);
    formData.append("employeeId", employeeId);
    formData.append("year", year);
    formData.append("form16FileUrl", file);
    console.log("formData", formData);

    // Make a POST request to upload the form
    fetch(`${process.env.REACT_APP_API}/route/add/form16`, {
      method: "POST",
      headers: {
        Authorization: authToken,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          handleAlert(true, "success", "Form 16 file uploaded Successfully.");
          handleClose();
          // window.location.reload();
        } else {
          handleAlert("Error uploading Form 16.");
        }
      })
      .catch((error) => {
        console.error("Error uploading Form 16:", error);
        handleAlert(error);
      });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
        >
          <div className="flex justify-between py-4 items-center  px-4">
            <h1 className="text-xl pl-2 font-semibold font-sans">
              Upload Form-16
            </h1>
          </div>
          <div className=" ml-6">
            <p>Which year form-16 do you want to upload?</p>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="year"
                name="year"
                value={year}
                onChange={handleYearChange}
              >
                <FormControlLabel
                  value="current"
                  control={<Radio />}
                  label="Current Year"
                />
                <FormControlLabel
                  value="previous"
                  control={<Radio />}
                  label="Previous Year"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className=" ml-6">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ marginTop: "10px" }}
            />
            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
          </div>

          <div className="px-5 space-y-4 mt-4">
            <div className="flex gap-4  mt-4 mr-4 justify-end mb-4 ">
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
              >
                Upload Form 16
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Form16UploadModal;
