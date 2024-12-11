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
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React, { useState, useEffect, useContext } from "react";
import useAdvanceSalaryState from "../../../hooks/AdvanceSalaryHook/useAdvanceSalaryState";
import useAdvanceSalaryQuery from "../../../hooks/AdvanceSalaryHook/useAdvanceSalaryQuery";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import UserProfile from "../../../hooks/UserData/useUser";

const ApplyAdvanceSalaryModal = ({ handleClose, open, organisationId }) => {
  // to define the state , hook  ,import other function if needed
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const userId = user._id;
  const [noofemiError, setNoOfEmiError] = useState("");
  const [errors, setErrors] = useState("");
  const [totalSalaryError, setTotalSalaryError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const {
    noOfMonth,
    advanceSalaryStartingDate,
    advanceSalaryEndingDate,
    setNoOfMonth,
    setAdvanceSalaryStartingDate,
    setAdvanceSalaryEndingDate,
  } = useAdvanceSalaryState();
  const { getTotalSalaryEmployee } = useAdvanceSalaryQuery(organisationId);

  useEffect(() => {
    if (advanceSalaryStartingDate && noOfMonth) {
      calculateCompletionDate(advanceSalaryStartingDate, noOfMonth);
    }
    // eslint-disable-next-line
  }, [advanceSalaryStartingDate, noOfMonth]);

  // to define the function for change the emi
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

  // to calculate the completion date
  const calculateCompletionDate = (startingDate, noOfMonth) => {
    const monthsToAdd = parseInt(noOfMonth);
    if (!isNaN(monthsToAdd)) {
      const completionDate = dayjs(startingDate)
        .add(monthsToAdd, "month")
        .format("MM-DD-YYYY");
      setAdvanceSalaryEndingDate(completionDate);
    }
  };

  const advancedSalaryAmounts =
    Number(getTotalSalaryEmployee) * Number(noOfMonth);

  // to define the function for change the file
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
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

  //for get loan data
  const { data: loanAmount } = useQuery(
    ["loaninfo", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${userId}/get-ongoing-loan-data`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  // to define the function for add the advance salary data
  const queryClient = useQueryClient();
  const AddAdvanceSalary = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-advance-salary`,
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
        setAdvanceSalaryStartingDate();
        setAdvanceSalaryEndingDate();
        setNoOfMonth();
      },
      onError: () => {
        setErrors("An Error occurred while applying advance salary data.");
      },
    }
  );

  // to define the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!getTotalSalaryEmployee || isNaN(getTotalSalaryEmployee)) {
      setTotalSalaryError("Total salary is invalid or not available.");
      return;
    }
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
      if (loanAmount && loanAmount.length > 0) {
        handleAlert(
          true,
          "error",
          "You cannot apply for advance salary as you have an ongoing loan."
        );
        return;
      }

      const formData = new FormData();
      formData.append("advanceSalaryStartingDate", advanceSalaryStartingDate);
      formData.append("advanceSalaryEndingDate", advanceSalaryEndingDate);
      formData.append("noOfMonth", noOfMonth);
      formData.append("advancedSalaryAmounts", advancedSalaryAmounts);
      formData.append("totalSalary", getTotalSalaryEmployee);
      formData.append("fileurl", file);

      await AddAdvanceSalary.mutateAsync(formData);
    } catch (error) {
      console.error(error);
      setErrors("An error occurred while adding advance salary data");
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
          Apply For Advance Salary
        </h1>
      </div>
      <div className="px-5 space-y-4 mt-4">
        <div>
          {formErrors.noOfMonth && (
            <p className="text-red-500">*{formErrors.noOfMonth}</p>
          )}
        </div>

        <div className="space-y-2 ">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              className="w-full"
              components={["DatePicker"]}
              required
            >
              <DatePicker
                label="Advance salary starting date"
                value={advanceSalaryStartingDate}
                onChange={(newDate) => {
                  const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
                  setAdvanceSalaryStartingDate(formattedDate);
                }}
                slotProps={{
                  textField: { size: "small", fullWidth: true },
                }}
                disablePast
              />
            </DemoContainer>
          </LocalizationProvider>
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
          <div>
            Advance salary amount :{" "}
            {isNaN(advancedSalaryAmounts) ? "0.00" : advancedSalaryAmounts}
          </div>
          {totalSalaryError && (
            <p className="text-red-500 mt-2">*{totalSalaryError}</p>
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

          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default ApplyAdvanceSalaryModal;
