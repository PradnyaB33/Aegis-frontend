import CloseIcon from "@mui/icons-material/Close";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import BasicButton from "../../BasicButton";

const CreateSalaryModel = ({
  handleClose,
  open,
  empId,
  id,
  incomeValues,
  setIncomeValues,
  deductionsValues,
  setDeductionsValues,
}) => {
  // state
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const [totalValues, setTotalValues] = useState([]);

  const handleIncomeChange = (e, setState) => {
    const { name, value } = e.target;

    setState((prevState) => {
      const existingIndex = prevState.findIndex((item) => item.name === name);

      if (existingIndex !== -1) {
        const updatedState = [...prevState];
        updatedState[existingIndex] = { name, value };
        return updatedState;
      } else {
        return [...prevState, { name, value }];
      }
    });
  };

  const calTotalSalary = () => {
    const income = incomeValues.reduce((a, c) => {
      return a + (parseInt(c.value) || 0);
    }, 0);

    const deductions = deductionsValues.reduce((a, c) => {
      return a + (parseInt(c.value) || 0);
    }, 0);

    const total = income - deductions;
    setTotalValues(total);
  };
  useEffect(() => {
    calTotalSalary();
    //eslint-disable-next-line
  }, [incomeValues, deductionsValues]);

  // to get employee salary component data
  const {
    data: salaryInput,
    isFetching,
    isError,
  } = useQuery(
    ["empData", empId],
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
  console.log("salaryInput", salaryInput);

  // to get the data of existing salary component
  // to get employee salary component data of employee
  const { data: salaryComponent } = useQuery(
    ["salary-component", empId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-salary-component/${empId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  console.log("salaryComponent", salaryComponent);

  useEffect(() => {
    setIncomeValues(salaryComponent?.income ?? []);
    setDeductionsValues(salaryComponent?.deductions ?? []);
    // eslint-disable-next-line
  }, [salaryComponent, empId]);

  console.log("incomeValues", incomeValues);

  const handleApply = async () => {
    try {
      // Filter out income components with null, undefined, or zero value, and also exclude those with invalid names
      const filteredIncomeValues = incomeValues?.filter(
        (item) =>
          item.name &&
          item.value !== null &&
          item.value !== undefined &&
          item.value !== 0 &&
          item.value !== ""
      );

      console.log("filter income value", filteredIncomeValues);

      // Filter out deduction components with null, undefined, or zero value, and also exclude those with invalid names
      const filteredDeductionsValues = deductionsValues?.filter(
        (item) =>
          item.name &&
          item.value !== null &&
          item.value !== undefined &&
          item.value !== ""
      );
      console.log("filter deduction value", filteredDeductionsValues);

      const data = {
        income: filteredIncomeValues,
        deductions: filteredDeductionsValues,
        totalSalary: totalValues,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/add-salary-component/${empId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      handleAlert(true, "success", "Salary Detail added Successfully");
      handleClose();
    } catch (error) {
      console.error("Error adding salary data:", error);
      handleAlert(true, "error", "Something went wrong");
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
        <h1 id="modal-modal-title" className="text-xl  font-semibold">
          {salaryComponent && salaryComponent?.income?.length > 0 ? "Update Salary" : "Create Salary"}
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
            <span className="text-[18px]  font-[600]">Name: </span>
            <span className="text-lg">
              {isFetching ? null : `${salaryInput?.employee?.first_name} ${salaryInput?.employee?.last_name}`}
            </span>  </p>
          <div className="overflow-auto  !p-0 bg-gray-200">
            <table className="min-w-full bg-white  text-left !text-sm font-light">
              <thead className="  border-b bg-gray-100 text-[18px] dark:border-neutral-500">
                <tr>
                  <th scope="col" className="!text-left py-3 px-2 ">
                    Salary
                  </th>
                  <th scope="col" className="py-3">
                    Enter The Input
                  </th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
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
                    <h1 className="text-[18px]  font-[600] p-2 ">
                      Income
                    </h1>
                    {salaryInput?.employee?.salarystructure?.income &&
                      salaryInput?.employee?.salarystructure?.income?.length >
                      0 &&
                      salaryInput?.employee?.salarystructure?.income?.map(
                        (item, id) => (
                          <tr key={id} className="space-y-4 w-full">
                            <td className="!text-left w-full px-2 py-3">
                              {item}
                            </td>
                            <td>
                              <input
                                type="number"
                                name={item}
                                value={
                                  incomeValues.find((ele) => ele?.name === item)
                                    ?.value
                                }
                                min={0}
                                onChange={(e) =>
                                  handleIncomeChange(e, setIncomeValues)
                                }
                                placeholder="Enter the input"
                                style={{
                                  padding: "10px",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                }}
                              />
                            </td>
                          </tr>
                        )
                      )}

                    <h1 className="text-[18px]  font-[600] p-2">
                      Deduction
                    </h1>
                    <p className="text-sm text-gray-600 px-2 pb-4">
                      If PF and ESIC are to be provided to employees, set them to 0; otherwise, leave them empty.
                    </p>
                    {salaryInput?.employee?.salarystructure?.deductions &&
                      salaryInput?.employee?.salarystructure?.deductions
                        ?.length > 0 &&
                      salaryInput?.employee?.salarystructure?.deductions?.map(
                        (item, id) => (
                          <tr key={id} className="space-y-6 w-full">
                            <td className="!text-left w-full px-2 py-3">
                              {item}
                            </td>
                            <td>
                              <input
                                type="number"
                                name={item}
                                value={
                                  deductionsValues.find(
                                    (ele) => ele?.name === item
                                  )?.value
                                }
                                onChange={(e) =>
                                  handleIncomeChange(e, setDeductionsValues)
                                }
                                placeholder="Enter the input"
                                style={{
                                  padding: "10px",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                }}
                              />
                            </td>
                          </tr>
                        )
                      )}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className="w-full">
            <Divider variant="fullWidth" orientation="horizontal" />
          </div>

          <div>
            <div className="flex items-center justify-between ">
              <span className="text-[18px]  font-[600] px-2">Total Salary</span>
              <p className="text-[18px]  font-[600] ">Rs. {totalValues ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-2  py-4 gap-2">
          <BasicButton title={"Submit"} onClick={handleApply} />
          <BasicButton title={"Cancel"} onClick={handleClose} variant="outlined" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSalaryModel;
