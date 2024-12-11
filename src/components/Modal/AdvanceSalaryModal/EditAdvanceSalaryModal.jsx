import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormLabel,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import useAdvanceSalaryState from "../../../hooks/AdvanceSalaryHook/useAdvanceSalaryState";
import useAdvanceSalaryQuery from "../../../hooks/AdvanceSalaryHook/useAdvanceSalaryQuery";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import Box from "@mui/material/Box";

const EditAdvanceSalaryModal = ({
  handleClose,
  open,
  organisationId,
  advanceSalary,
}) => {
  // to define the state , hook
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const [noofemiError, setNoOfEmiError] = useState("");
  const [errors, setErrors] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [file, setFile] = useState(null);
  const [advanceSalaryId, setAdvanceSalaryId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    noOfMonth,
    advanceSalaryStartingDate,
    advanceSalaryEndingDate,
    setEmployeeId,
    setNoOfMonth,
    setAdvanceSalaryStartingDate,
    setAdvanceSalaryEndingDate,
  } = useAdvanceSalaryState();
  useEffect(() => {
    if (advanceSalary) {
      setAdvanceSalaryStartingDate(
        dayjs(advanceSalary?.advanceSalaryStartingDate)
      );
      setNoOfMonth(advanceSalary?.noOfMonth);
      setFile(advanceSalary.file);
      setAdvanceSalaryId(advanceSalary._id);
    }
  }, [
    advanceSalary,
    setEmployeeId,
    setAdvanceSalaryStartingDate,
    setNoOfMonth,
    setAdvanceSalaryId,
  ]);
  const { getTotalSalaryEmployee } = useAdvanceSalaryQuery(organisationId);

  const getFileNameFromURL = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };
  useEffect(() => {
    if (advanceSalaryStartingDate && noOfMonth) {
      calculateCompletionDate(advanceSalaryStartingDate, noOfMonth);
    }
    // eslint-disable-next-line
  }, [advanceSalaryStartingDate, noOfMonth]);

  // to define the funciton for change the no of emi
  const handleNoOfEmiChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && parseInt(value) >= 0) {
      setNoOfMonth(value);
      setNoOfEmiError("");
      if (advanceSalaryStartingDate) {
        calculateCompletionDate(advanceSalaryStartingDate, value);
      }
    } else {
      setNoOfMonth("");
      setNoOfEmiError("No of month should not be negative");
    }
  };

  // to define functin for calculating the compleiton data
  const calculateCompletionDate = (startingDate, noOfMonth) => {
    const monthsToAdd = parseInt(noOfMonth);
    if (!isNaN(monthsToAdd)) {
      const completionDate = dayjs(startingDate)
        .add(monthsToAdd, "month")
        .format("MM-DD-YYYY");
      setAdvanceSalaryEndingDate(completionDate);
    }
  };
  const advancedSalaryAmounts = getTotalSalaryEmployee * noOfMonth;

  // to define the function for change the file
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

  // to define the function for update the advance salary
  const queryClient = useQueryClient();
  const UpdateAdvanceSalary = useMutation(
    (data) =>
      axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${advanceSalaryId}/update-advance-salary-data`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),

    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["advanceSalary"] });
        handleAlert(
          true,
          "success",
          "Your advance salary application has been submitted successfully. It is now awaiting approval from HR"
        );
        handleClose();
      },
      onError: () => {
        setErrors("An Error occurred while applying advance salary data.");
      },
    }
  );

  // ṭo define the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requiredFields = ["advanceSalaryStartingDate", "noOfMonth"];
      const data = {
        advanceSalaryStartingDate: advanceSalaryStartingDate,
        advanceSalaryEndingDate: advanceSalaryEndingDate,
        noOfMonth: noOfMonth,
        advancedSalaryAmounts: advancedSalaryAmounts,
        totalSalary: getTotalSalaryEmployee,
        file: file,
      };
      const missingFields = requiredFields.filter((field) => !data[field]);
      if (missingFields.length > 0) {
        const errors = {};
        missingFields.forEach((field) => {
          errors[field] = "All fields are required";
        });
        setFormErrors(errors);
        return;
      }

      const formData = new FormData();
      formData.append("advanceSalaryStartingDate", advanceSalaryStartingDate);
      formData.append("advanceSalaryEndingDate", advanceSalaryEndingDate);
      formData.append("noOfMonth", noOfMonth);
      formData.append("advancedSalaryAmounts", advancedSalaryAmounts);
      formData.append("totalSalary", getTotalSalaryEmployee);
      formData.append("fileurl", file);

      await UpdateAdvanceSalary.mutateAsync(formData);
    } catch (error) {
      console.error(error);
      setErrors("An error occurred while updating advance salary data");
    }
  };
  console.log(errors);

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "800px!important",
          height: "100%",
          maxHeight: "85vh!important",
        },
      }}
      open={open}
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="flex w-full justify-between py-4 items-center  px-4">
        <h1 className="text-xl pl-2 font-semibold font-sans">
          Edit Advance Salary
        </h1>
      </div>
      <div className="px-5 space-y-4 mt-4">
        <div>
          {formErrors.noOfMonth && (
            <p className="text-red-500">*{formErrors.noOfMonth}</p>
          )}
        </div>
        {/* <div className="space-y-2">
          <FormControl fullWidth sx={{ marginBottom: "1rem" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]} className="w-full">
                <DatePicker
                  label="Advance salary starting date"
                  value={
                    advanceSalaryStartingDate
                      ? dayjs(advanceSalaryStartingDate)
                      : null
                  }
                  onChange={(newValue) =>
                    setAdvanceSalaryStartingDate(dayjs(newValue))
                  }
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      error: Boolean(formErrors.advanceSalaryStartingDate),
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
            {formErrors.loanDisbursementDate && (
              <Typography color="error">
                {formErrors.loanDisbursementDate}
              </Typography>
            )}
          </FormControl>
        </div> */}
        <div className="space-y-2">
          <FormControl fullWidth sx={{ marginBottom: "1rem" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box width="100%">
                {" "}
                {/* Wrap the DatePicker in a Box with full width */}
                <DatePicker
                  label="Advance salary starting date"
                  value={
                    advanceSalaryStartingDate
                      ? dayjs(advanceSalaryStartingDate)
                      : null
                  }
                  onChange={(newValue) =>
                    setAdvanceSalaryStartingDate(dayjs(newValue))
                  }
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      error: Boolean(formErrors.advanceSalaryStartingDate),
                      fullWidth: true, // Ensure the TextField inside DatePicker is full width
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
            {formErrors.loanDisbursementDate && (
              <Typography color="error">
                {formErrors.loanDisbursementDate}
              </Typography>
            )}
          </FormControl>
        </div>
        <div className="space-y-2 ">
          <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
            <InputLabel>No of Month</InputLabel>
            <OutlinedInput
              value={noOfMonth}
              onChange={handleNoOfEmiChange}
              label="No of Month"
            />
          </FormControl>
          {noofemiError && <p className="text-red-500">*{noofemiError}</p>}
        </div>
        <div className="space-y-2">
          <FormControl>
            <FormLabel htmlFor="file-upload" className="text-md mb-2">
              Upload Document
            </FormLabel>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="file-upload">
                <input
                  style={{ display: "none" }}
                  id="file-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />

                <Button variant="contained" component="span">
                  Upload Document
                </Button>
              </label>
              {file && <p className="text-green-500 ml-2 mt-2">{file.name}</p>}
            </div>
            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
          </FormControl>
        </div>
        <div className="px-2 space-y-4 mt-4">
          <div>
            Advance salary completion date : {advanceSalaryEndingDate || ""}
          </div>
          <div>Advance salary amount : {advancedSalaryAmounts ?? "0.00"}</div>
          {advanceSalary && advanceSalary.file && (
            <div className="flex items-center mt-2">
              <InsertDriveFileIcon color="action" className="mr-2" />
              <Typography variant="body2" color="textSecondary">
                File Name: {getFileNameFromURL(advanceSalary.file)}
              </Typography>
            </div>
          )}
        </div>

        <DialogContent>
          <Typography variant="body2">Declaration :</Typography>
          <Typography variant="body2" color="textSecondary">
            I declare that I have availded any other Salary advance during this
            year and also confirm that there are no dues standing to my credit
            towards balance of advance drawn by me during last year.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "end" }}>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Apply
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default EditAdvanceSalaryModal;
