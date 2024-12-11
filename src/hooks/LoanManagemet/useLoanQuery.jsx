import { useContext, useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";
import useLaonState from "./useLaonState";
import UserProfile from "../UserData/useUser";
const useLoanQuery = (organisationId) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const userId = user._id;
  const { loanType, setRateOfInterest } = useLaonState(); 

  const getEmployeeLoanapi = async (api) => {
    try {
      const response = await axios.get(`${api}`, {
        headers: {
          Authorization: authToken,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };  

  const LoanTypeListCall = () => {
    const { data: LoanTypeList } = useQuery({
      queryKey: ["loan-type-info"],
      queryFn: () =>
        getEmployeeLoanapi(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-loan-type`,
        ),
    });

    return LoanTypeList;
  };


  //for  Get Query to get loan type
  const { data: getEmployeeLoanType } = useQuery(
    ["loanType", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-loan-type`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );
  useEffect(() => {
    if (getEmployeeLoanType?.length > 0 && loanType) {
      const selectedLoanType = getEmployeeLoanType.find(
        (item) => item._id === loanType
      );
      if (selectedLoanType && selectedLoanType.rateOfInterest) {
        setRateOfInterest(selectedLoanType.rateOfInterest);
      }
    }
  }, [getEmployeeLoanType, loanType, setRateOfInterest]);

  //for  Get Query to total salary
  const { data: getTotalSalaryEmployee } = useQuery(
    ["totalSalary", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/${organisationId}/total-salary`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      const totalSalary = response.data.totalSalary;
      return totalSalary;
    }
  );

  // get the employee whose raised a request for loan applicaiton
  const { data: getEmployeeRequestLoanApltn } = useQuery(
    ["empLoanApplyRequest"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/pendingLoans`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

   //for get loan data
   const { data: getDeductionOfLoanData } = useQuery(
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
  return {
    getEmployeeLoanType,
    getDeductionOfLoanData ,
    getTotalSalaryEmployee,
    getEmployeeRequestLoanApltn,
    LoanTypeListCall
  };
};

export default useLoanQuery;