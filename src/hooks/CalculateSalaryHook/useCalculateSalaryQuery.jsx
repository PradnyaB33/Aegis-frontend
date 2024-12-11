import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { useContext, useEffect, useState } from "react";
import { TestContext } from "../../State/Function/Main";
import { useQuery } from "react-query";

const useCalculateSalaryQuery = ({
  userId,
  organisationId,
  remotePunchingCount,
}) => {
  // state, hook
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];

  // get the alreday salary data created
  const [salaryInfo, setSalaryInfo] = useState([]);
  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employeeSalary/viewpayslip/${userId}/${organisationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setSalaryInfo(response.data.salaryDetails);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchEmployeeData();
    // eslint-disable-next-line
  }, []);

  //  to get the employee
  const [availableEmployee, setAvailableEmployee] = useState();
  const fetchAvailableEmployee = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get/profile/${userId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAvailableEmployee(response.data.employee);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch User Profile Data");
    }
  };
  useEffect(() => {
    fetchAvailableEmployee();
    // eslint-disable-next-line
  }, []);

  // pull the total deduction of loan of employee if he/she apply the loan
  const { data: empLoanAplicationInfo } = useQuery(
    ["empLoanAplication", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${userId}/get-ongoing-loan-data`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.data;
    }
  );

  // to get remote punching amount
  const { data: getremotePuncingAmount } = useQuery(
    ["remote-punching"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/remote-punch/${organisationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.remotePunchingObject.allowanceQuantity;
    }
  );

  const isValidAmount =
    !isNaN(getremotePuncingAmount) &&
    getremotePuncingAmount !== null &&
    getremotePuncingAmount !== undefined;

  const isValidCount =
    !isNaN(remotePunchingCount) &&
    remotePunchingCount !== null &&
    remotePunchingCount !== undefined;

  const remotePunchAllowance =
    isValidAmount && isValidCount
      ? remotePunchingCount * getremotePuncingAmount
      : 0;

  return {
    salaryInfo,
    availableEmployee,
    empLoanAplicationInfo,
    remotePunchAllowance,
  };
};

export default useCalculateSalaryQuery;
