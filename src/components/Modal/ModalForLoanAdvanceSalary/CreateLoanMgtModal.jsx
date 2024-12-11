import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  FormLabel,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import useLaonState from "../../../hooks/LoanManagemet/useLaonState";
import useLoanQuery from "../../../hooks/LoanManagemet/useLoanQuery";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import useCalculation from "../../../hooks/LoanManagemet/useCalculation";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const CreateLoanMgtModal = ({ handleClose, open, organisationId }) => {
  // to define the state , hook and import other function if user needed
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const [noofemiError, setNoOfEmiError] = useState("");
  const [errors, setErrors] = useState("");
  const [loanAmountError, setLoanAmountError] = useState("");
  const [loanValue, setLoanValue] = useState(0);
  const [maxLoanValue, setMaxLoanValue] = useState(0);
  const [formErrors, setFormErrors] = useState({});

  const {
    loanType,
    rateOfIntereset,
    loanAmount,
    loanDisbursementDate,
    noOfEmi,
    loanCompletedDate,
    setLoanType,
    setLoanAmount,
    setDisbursementDate,
    setNoOfEmi,
    setCompletedDate,
    setRateOfInterest,
    setPrincipalAmount,
    setInteresetAmount,
    setTotalDeduction,
    setTotalDeductionWithSi,
  } = useLaonState();

  const {
    principalPerMonth,
    totalDeductionPerMonth,
    totalAmountWithSimpleInterest,
    interestPerMonths,
  } = useCalculation();

  const {
    getEmployeeLoanType,
    getTotalSalaryEmployee,
    getDeductionOfLoanData,
  } = useLoanQuery(organisationId);

  // to write the useEffect get the loan value or max loan value based on selected loan
  useEffect(() => {
    if (loanType) {
      const selectedLoanType = getEmployeeLoanType.find(
        (item) => item._id === loanType
      );
      if (selectedLoanType) {
        setLoanValue(selectedLoanType.loanValue);
        setMaxLoanValue(selectedLoanType.maxLoanValue);
      }
    }
  }, [loanType, getEmployeeLoanType]);

  useEffect(() => {
    if (loanDisbursementDate && noOfEmi) {
      calculateCompletionDate(loanDisbursementDate, noOfEmi);
    }
    // eslint-disable-next-line
  }, [loanDisbursementDate, noOfEmi]);

  // to define the function change the no of emi
  const handleNoOfEmiChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && parseInt(value) >= 0) {
      setNoOfEmi(value);
      setNoOfEmiError("");
      if (loanDisbursementDate) {
        calculateCompletionDate(loanDisbursementDate, value);
      }
    } else {
      setNoOfEmi("");
      setNoOfEmiError("No of EMI should not be negative");
    }
  };

  // to define the function for calculation compleiton data
  const calculateCompletionDate = (disbursementDate, emiCount) => {
    const monthsToAdd = parseInt(emiCount);
    if (!isNaN(monthsToAdd)) {
      const completionDate = dayjs(disbursementDate)
        .add(monthsToAdd, "month")
        .format("MM-DD-YYYY");
      setCompletedDate(completionDate);
    }
  };

  // to define the function for set the file
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

  // to define the function to add the loan data
  const queryClient = useQueryClient();
  const AddLoanData = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-loan-data`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),

    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["loanDatas"] });
        handleAlert(
          true,
          "success",
          "Your loan application has been submitted successfully. It is now awaiting approval from HR"
        );
        handleClose();
        setLoanType();
        setLoanAmount();
        setDisbursementDate();
        setNoOfEmi();
        setRateOfInterest();
        setMaxLoanValue();
        setLoanValue();
        setCompletedDate();
        setPrincipalAmount();
        setInteresetAmount();
        setTotalDeduction();
        setTotalDeductionWithSi();
      },
      onError: () => {
        setErrors("An Error occurred while creating a loan data.");
      },
    }
  );

  //  to define the function for check is loan amount is fifty percent of total salary of employee
  const createLoanData = async (loanData) => {
    const totalSalary = getTotalSalaryEmployee;
    const fiftyPercentOfSalary = totalSalary * 0.5;

    const totalExistingDeductions =
      getDeductionOfLoanData?.reduce(
        (acc, loans) => acc + loans.totalDeduction,
        0
      ) || 0;

    const newLoanDeduction = totalDeductionPerMonth || 0;

    const totalDeduction =
      parseInt(totalExistingDeductions) + parseInt(newLoanDeduction);

    if (totalDeduction > fiftyPercentOfSalary) {
      handleAlert(
        true,
        "error",
        "Total deduction amount should not exceed 50% of your total monthly salary"
      );
      return;
    }

    try {
      await AddLoanData.mutateAsync(loanData);
    } catch (error) {
      console.error("An error occurred while creating a loan data", error);
      setErrors("An Error occurred while creating a loan data.");
    }
  };

  // this function is for pass the loan data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requiredFields = [
        "loanType",
        "loanAmount",
        "loanDisbursementDate",
        "noOfEmi",
      ];
      const data = {
        loanType: loanType,
        rateOfIntereset: rateOfIntereset,
        loanAmount: loanAmount,
        loanDisbursementDate: loanDisbursementDate,
        loanCompletedDate: loanCompletedDate,
        noOfEmi: noOfEmi,
        loanPrincipalAmount: principalPerMonth,
        loanInteresetAmount: interestPerMonths,
        totalDeduction: totalDeductionPerMonth,
        totalDeductionWithSi: totalAmountWithSimpleInterest,
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
      formData.append("loanType", loanType);
      formData.append("rateOfIntereset", rateOfIntereset);
      formData.append("loanAmount", loanAmount);
      formData.append("loanDisbursementDate", loanDisbursementDate);
      formData.append("loanCompletedDate", loanCompletedDate);
      formData.append("noOfEmi", noOfEmi);
      formData.append("loanPrincipalAmount", principalPerMonth);
      formData.append("loanInteresetAmount", interestPerMonths);
      formData.append("totalDeduction", totalDeductionPerMonth);
      formData.append("totalDeductionWithSi", totalAmountWithSimpleInterest);
      formData.append("totalSalary", getTotalSalaryEmployee);
      formData.append("fileurl", file);

      await createLoanData(formData);
    } catch (error) {
      console.error(error);
      setErrors("An error occurred while creating loan data");
    }
  };

  console.log(errors);
  console.log(loanValue);

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
        <h1 className="text-xl pl-6 font-semibold font-sans">
          Apply For Loans
        </h1>
      </div>

      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <div className="px-5 space-y-4 mt-4">
          <div className="px-5 space-y-4 mt-4">
            <div>
              {formErrors.noOfEmi && (
                <p className="text-red-500">*{formErrors.noOfEmi}</p>
              )}
            </div>
            <div className="space-y-2 ">
              <FormLabel className="text-md mb-2">Select loan type</FormLabel>
              <FormControl size="small" fullWidth>
                <InputLabel>Loan type</InputLabel>
                <Select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  label="loan type"
                >
                  {getEmployeeLoanType?.length > 0 ? (
                    getEmployeeLoanType?.map((item, id) => (
                      <MenuItem key={id} value={item?._id}>
                        {item?.loanName}
                      </MenuItem>
                    ))
                  ) : (
                    <div className="flex w-full items-center justify-center p-2">
                      No data Found
                    </div>
                  )}
                </Select>
              </FormControl>
            </div>

            <div className="space-y-2">
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel>Loan amount Rs</InputLabel>
                <OutlinedInput
                  value={loanAmount}
                  onChange={(e) => {
                    const amount = e.target.value;
                    setLoanAmount(amount);
                    if (amount <= maxLoanValue) {
                      if (amount >= loanValue) {
                        setLoanAmountError("");
                      } else {
                        setLoanAmountError(
                          "You cannot take the loan amount less than the minimum loan value."
                        );
                      }
                    } else {
                      setLoanAmountError(
                        "You cannot take the loan amount greater than maximum loan value."
                      );
                    }
                  }}
                  id="outlined-adornment-password"
                  label="Loan amount Rs"
                  type="number"
                  inputProps={{ min: "0" }}
                />
              </FormControl>

              {loanAmountError && (
                <p className="text-red-500">*{loanAmountError}</p>
              )}
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                className="w-full"
                components={["DatePicker"]}
                required
              >
                <DatePicker
                  label="Loan Disbursement date"
                  value={loanDisbursementDate}
                  onChange={(newDate) => {
                    const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
                    setDisbursementDate(formattedDate);
                    // setError("");
                  }}
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                  disablePast
                />
              </DemoContainer>
            </LocalizationProvider>

            <div className="space-y-2 ">
              <FormLabel className="text-md">
                No of EMIs for loan prepayment
              </FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel>No of EMIs</InputLabel>
                <OutlinedInput
                  value={noOfEmi}
                  onChange={handleNoOfEmiChange}
                  label="No of EMIs"
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
                  {file && (
                    <p className="text-green-500 ml-2 mt-2">{file.name}</p>
                  )}
                </div>
                {errorMessage && (
                  <p className="text-red-500 mt-2">{errorMessage}</p>
                )}
              </FormControl>
            </div>

            <div>Rate of Interest : {rateOfIntereset || ""}</div>
            <div>Min loan value : {loanValue ?? "0"}</div>
            <div>Max loan value : {maxLoanValue ?? "0"}</div>
            <div>Loan completion date : {loanCompletedDate || ""}</div>
            <div>Principal amount monthly : {principalPerMonth ?? "0.00"}</div>
            <div>Interest amount monthly : {interestPerMonths ?? "0.00"}</div>
            <div>
              Total amount monthly deducted : {totalDeductionPerMonth ?? "0.00"}
            </div>
            <div>
              Total amount with simple interest :{" "}
              {totalAmountWithSimpleInterest || "0.00"}
            </div>
          </div>

          <DialogContent className="w-full">
            <Typography variant="body2">Declaration :</Typography>
            <Typography variant="body2" color="textSecondary">
              I declare that I have not availed any other loan during this year
              and also confirm that there are no dues standing to my credit
              towards loan drawn by me during last year . I agree to pay loan
              amount as per above information.
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
      </DialogContent>
    </Dialog>
  );
};

export default CreateLoanMgtModal;
