import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
const UpdateSalaryModal = ({ handleClose, open, empId }) => {
  // states
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const [errorMessage, setErrorMessage] = useState("");
  const [deduction, setDeduction] = useState("");
  const [employee_pf, setEmployeePf] = useState("");
  const [esic, setEsic] = useState("");
  console.log(setErrorMessage);
  const [inputValue, setInputValue] = useState({
    Basic: "",
    HRA: "",
    DA: "",
    "Food allowance": "",
    "Variable allowance": "",
    "Special allowance": "",
    "Travel allowance": "",
    "Sales allowance": "",
  });

  // get query to fetch the employee
  const {
    data: salaryInput,
    isLoading,
    isError,
  } = useQuery(
    ["empDatas", empId],
    async () => {
      if (open && empId !== null) {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get/profile/${empId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data;
      }
    },
    {
      enabled: open && empId !== null && empId !== undefined,
    }
  );

  useEffect(() => {
    if (
      salaryInput !== undefined &&
      salaryInput !== null &&
      salaryInput.employee &&
      salaryInput.employee.salaryComponent
    ) {
      setDeduction(salaryInput.employee.deduction ?? "");
      setEsic(salaryInput.employee.esic ?? "");
      setEmployeePf(salaryInput.employee.employee_pf ?? "");
      setInputValue({
        Basic: salaryInput.employee.salaryComponent.Basic ?? "",
        HRA: salaryInput.employee.salaryComponent.HRA ?? "",
        DA: salaryInput.employee.salaryComponent.DA ?? "",
        "Food allowance":
          salaryInput.employee.salaryComponent["Food allowance"] ?? "",
        "Variable allowance":
          salaryInput.employee.salaryComponent["Variable allowance"] ?? "",
        "Special allowance":
          salaryInput.employee.salaryComponent["Special allowance"] ?? "",
        "Travel allowance":
          salaryInput.employee.salaryComponent["Travel allowance"] ?? "",
        "Sales allowance":
          salaryInput.employee.salaryComponent["Sales allowance"] ?? "",
      });
    }
  }, [salaryInput]);

  // Function to calculate total salary
  const calculateTotalSalary = () => {
    const {
      Basic,
      HRA,
      DA,
      "Food allowance": foodAllowance,
      "Variable allowance": variableAllowance,
      "Special allowance": specialAllowance,
      "Travel allowance": travelAllowance,
      "Sales allowance": salesAllowance,
    } = inputValue;

    const basicValue = parseFloat(Basic) || 0;
    const hraValue = parseFloat(HRA) || 0;
    const daValue = parseFloat(DA) || 0;
    const foodAllowanceValue = parseFloat(foodAllowance) || 0;
    const variableAllowanceValue = parseFloat(variableAllowance) || 0;
    const specialAllowanceValue = parseFloat(specialAllowance) || 0;
    const travelAllowanceValue = parseFloat(travelAllowance) || 0;
    const salesAllowanceValue = parseFloat(salesAllowance) || 0;
    const deductionValue = parseFloat(deduction) || 0;
    const employeePfValue = parseFloat(employee_pf) || 0;
    const esicValue = parseFloat(esic) || 0;
    const total =
      basicValue +
      hraValue +
      daValue +
      foodAllowanceValue +
      variableAllowanceValue +
      specialAllowanceValue +
      travelAllowanceValue +
      salesAllowanceValue -
      deductionValue -
      employeePfValue -
      esicValue;

    return total.toFixed(2);
  };
  let totalSalary = calculateTotalSalary();

  console.log(totalSalary);

  const handleInputChange = (name, value) => {
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const queryClient = useQueryClient();

  const EditShift = useMutation(
    (data) =>
      axios.put(
        `${process.env.REACT_APP_API}/route/employee/salary/update/${empId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["editsalary"] });
        handleClose();
        handleAlert(true, "success", "Salary updated succesfully");
        console.log("data", data);
      },
      onError: () => {
        handleAlert(true, "error", "An error occurred while updating salary");
      },
    }
  );
 

  // function for edit salary data
  const EditSalaryData = async (data) => {
    try {
      const data = {
        inputValue,
        deduction,
        employee_pf,
        esic,
        totalSalary,
      };

      await EditShift.mutateAsync(data);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "An error occurred while updating salary");
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "900px!important",
          height: "70%",
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
        <h1 id="modal-modal-title" className="text-lg pl-2 font-semibold">
          Update Salary
        </h1>
        <IconButton onClick={handleClose}>
          <CloseIcon className="!text-[16px]" />
        </IconButton>
      </div>

      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>

        <div className="px-5 space-y-4 mt-4">
          <p className="text-md">
            Update Salary For{" "}
            <span className="text-lg  font-semibold">{`${salaryInput?.employee?.first_name} ${salaryInput?.employee?.last_name}`}</span>
          </p>
          <p className="text-md">Salary Component</p>
          <div className="overflow-auto  !p-0 bg-gray-200">
            <table className="min-w-full bg-white  text-left !text-sm font-light">
              <thead className="border-b bg-gray-100  font-medium dark:border-neutral-500">
                <tr>
                  <th scope="col" className="!text-left pl-8 py-3 ">
                    Salary Component
                  </th>
                  <th scope="col" className="py-3 pl-8">
                    Enter The Input
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={2}>
                      <CircularProgress />
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={2}>Error fetching data</td>
                  </tr>
                ) : !salaryInput ? (
                  <tr>
                    <td colSpan={2}>No data available</td>
                  </tr>
                ) : (
                  <>
                    {salaryInput?.employee?.salarystructure?.salaryStructure &&
                      salaryInput?.employee?.salarystructure?.salaryStructure
                        ?.length > 0 &&
                      salaryInput?.employee?.salarystructure?.salaryStructure?.map(
                        (item, id) => (
                          <tr key={id} className="space-y-4 w-full">
                            <td className="!text-left w-full pl-8 pr-8 py-3">
                              {item?.salaryComponent ?? ""}
                            </td>
                            <td>
                              <input
                                type="number"
                                placeholder="Enter the input"
                                style={{
                                  padding: "10px",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                }}
                                value={inputValue[item?.salaryComponent] ?? ""}
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  if (!isNaN(inputValue) && inputValue >= 0) {
                                    handleInputChange(
                                      item?.salaryComponent,
                                      inputValue
                                    );
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        )
                      )}
                  </>
                )}
                <tr className="!mt-4">
                  <td className="!text-left pl-8 pr-8 py-3">
                    Professinal Tax (Deduction)
                  </td>
                  <input
                    type="number"
                    placeholder="Enter the input"
                    style={{
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      marginTop: "10px",
                    }}
                    value={deduction}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (!isNaN(inputValue) && inputValue >= 0) {
                        setDeduction(inputValue);
                      }
                    }}
                  />
                </tr>
                <tr>
                  <td className="!text-left pl-8 pr-8 py-3">Employee PF</td>
                  <td className="py-3 ">
                    <input
                      type="number"
                      placeholder="Enter the input"
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                      value={employee_pf}
                      onChange={(e) => {
                        const inputValue1 = e.target.value;
                        if (!isNaN(inputValue1) && inputValue1 >= 0) {
                          setEmployeePf(inputValue1);
                        }
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="!text-left pl-8 pr-8 py-3">ESIC</td>
                  <td className="py-3 ">
                    <input
                      type="number"
                      placeholder="Enter the input"
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                      value={esic}
                      onChange={(e) => {
                        const inputValue2 = e.target.value;
                        if (!isNaN(inputValue2) && inputValue2 >= 0) {
                          setEsic(inputValue2);
                        }
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-full">
            <Divider variant="fullWidth" orientation="horizontal" />
          </div>
          <div style={{ height: "5px", width: "280px" }}>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between py-3 px-4">
              <span className="font-semibold">Total Salary</span>
              <input
                type="number"
                placeholder="Total Salary"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                  fontWeight: "bold",
                }}
                value={totalSalary}
                readOnly
              />
            </div>
          </div>

          <DialogActions>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={EditSalaryData}
              variant="contained"
              color="primary"
            >
              Apply
            </Button>
          </DialogActions>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default UpdateSalaryModal;
